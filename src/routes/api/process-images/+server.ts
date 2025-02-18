import { json } from '@sveltejs/kit';
import OpenAI from "openai";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import type { ChatCompletionContentPart } from 'openai/resources/chat/completions';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_PROMPT = `Analiza las imagenes que te adjunto, la cuales contiene la carta de un restaurante. Extrae y organiza la información de la siguiente forma:

- Identifica las categorías o secciones de la carta (por ejemplo: Entradas, Platos Principales, Postres, Bebidas). Trata de utilizar todo el contenido visible de la imagen, no dejes nada sin procesar que esté relacionado a platos de la carta
- Para cada categoría, extrae los nombres de los platos y sus respectivos precios.
- Si hay descripciones adicionales, inclúyelas en el campo "descripcion".
-Para los precios, utiliza el formato precio: 10.00. Sin comillas.

Devuelve la información en formato typescript (con JSON adentro) exactamente como el texto de abajo encerrado entre <prompt>  y  </prompt> 
El archivo va a ser input para un script que genera un archivo de seed data para popular la base de datos, entonces tiene que ser sintácticamente correcto.
Por ejemplo, el formato de salida debe ser similar a:

<prompt> 
export const seedData = {
  userEmail: "chico10117@gmail.com",
  restaurant: {
    name: Name of the restaurant,
    logo: "",
    customPrompt: "
RESTAURANT INFO
Descripción del restaurante
y toda la información relevante
como horarios, ubicación, etc.
"
  },

  restaurant: {   
    name: "Burger",
    description: "all relevant data from restaurant on image"
  },
  categories: [
    {
      name: Entradas,
      dishes: [
        {
          title: "Ensalada César",
          description: "Con pollo, lechuga y crutones",
          price: 10.00
          allergens: ["pollo", "huevo", "lacteos"],
          portions: "100gr",
          
        },
        {
          title: "Sopa de Mariscos",
          description: "Con pollo, lechuga y crutones",
          price: 12.50,
          allergens: ['lácteos', 'huevo', 'mariscos'],
          portions: "200gr"
        }
      ]
    },
    {
      name: "Platos Principales",
      dishes: [
        {
          title: "Filete de Res",
          description: "Con arroz, papas y vegetales",
          price: 20.00,
          allergens: [, "gluten"],
          portions: "200gr"
        }
      ]
    }
  ]
}
</prompt> 
`;

interface ImageData {
    page: number;
    base64: string;
}

interface RequestData {
    prompt?: string;
    images: ImageData[];
}

export async function POST({ request }) {
    try {
        console.log('Starting process-images...');
        
        // Recibe el payload enviado desde el cliente
        const { prompt, images }: RequestData = await request.json();
        console.log('Received request:', {
            hasPrompt: !!prompt,
            imagesCount: images.length
        });

        const contentList: ChatCompletionContentPart[] = [
            {
                type: 'text' as const,
                text: prompt || DEFAULT_PROMPT
            },
            ...images.map((img: ImageData) => ({
                type: 'image_url' as const,
                image_url: { url: `data:image/png;base64,${img.base64}` }
            }))
        ];
        console.log('Prepared content for OpenAI:', {
            contentListLength: contentList.length,
            promptLength: (prompt || DEFAULT_PROMPT).length
        });

        // Envía la petición a la API de OpenAI
        console.log('Sending request to OpenAI...');
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: contentList
                }
            ],
            response_format: {
                type: "json_object"
            },
            //max_tokens: 4096,
            temperature: 0
        });
        
        console.log('OpenAI response received:', {
            hasChoices: !!response.choices.length,
            firstChoiceHasContent: !!response.choices[0]?.message?.content
        });
        
        const content = response.choices[0].message.content;
        
        if (!content) {
            console.error('No content received from OpenAI');
            throw new Error('No content received from OpenAI');
        }

        // Try to extract the JSON content between <prompt> and </prompt> tags
        const promptMatch = content.match(/<prompt>\s*([\s\S]*?)\s*<\/prompt>/);
        const jsonContent = promptMatch ? promptMatch[1].trim() : content;

        console.log('Parsing OpenAI response content...');
        let parsedContent;
        try {
            // First try to parse it as is
            parsedContent = JSON.parse(jsonContent);
        } catch (parseError) {
            try {
                // If that fails, try to evaluate it as a TypeScript/JavaScript expression
                // This is needed because the response might include the "export const seedData = " part
                const cleanedContent = jsonContent.replace(/export\s+const\s+seedData\s*=\s*/, '').replace(/;$/, '');
                parsedContent = JSON.parse(cleanedContent);
            } catch (secondParseError) {
                console.error('Failed to parse OpenAI response:', {
                    content: jsonContent,
                    error: secondParseError
                });
                throw new Error('Failed to parse OpenAI response: Invalid JSON format');
            }
        }

        console.log('Content parsed successfully:', {
            hasRestaurant: !!parsedContent.restaurant,
            categoriesCount: parsedContent.categories?.length
        });
        
        const restaurantName = parsedContent.restaurant?.name || 'unknown';
        const sanitizedName = restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Create the file path with correct directory - using static/data instead of src/lib
        const dataDir = join(process.cwd(), 'static', 'data', 'restaurants');
        const fileName = `restaurant-data-${sanitizedName}-${Date.now()}.ts`;
        const filePath = join(dataDir, fileName);

        console.log('Preparing to save data:', {
            directory: dataDir,
            fileName,
            fullPath: filePath
        });

        // Ensure the directory exists
        try {
            await mkdir(dataDir, { recursive: true });
            console.log('Directory created/verified');
        } catch (err) {
            const error = err as { code?: string };
            if (error.code !== 'EEXIST') {
                console.error('Error creating directory:', error);
                throw err;
            }
        }

        // Format the content as a TypeScript export
        const fileContent = `export const seedData = ${content};\n`;

        // Write to file
        console.log('Writing data to file...');
        await writeFile(filePath, fileContent, 'utf-8');
        console.log('Data saved successfully to:', filePath);

        // Return both the content and the file path to the client
        return json({
            content: parsedContent,
            savedTo: fileName
        });
    } catch (err) {
        const error = err as Error;
        console.error('Error in process-images:', {
            error,
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return json({ error: error.message }, { status: 500 });
    }
}