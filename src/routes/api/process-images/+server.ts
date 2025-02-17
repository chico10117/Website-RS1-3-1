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
        // Recibe el payload enviado desde el cliente
        const { prompt, images }: RequestData = await request.json();
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

        // Envía la petición a la API de OpenAI
        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: contentList
                }
            ],
            response_format: {
                type: "json_object"
            },
            temperature: 0,
            max_tokens: 4096
        });
        
        console.log("Respuesta de OpenAI:", response.choices[0]);
        const content = response.choices[0].message.content;
        
        if (!content) {
            throw new Error('No content received from OpenAI');
        }

        console.log("Content before writing:", content);
        
        // Parse the JSON to get restaurant name
        const parsedContent = JSON.parse(content);
        const restaurantName = parsedContent.restaurant?.name || 'unknown';
        const sanitizedName = restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Create the file path with correct directory
        const dataDir = join(process.cwd(), 'src', 'lib', 'data', 'restaurants');
        const fileName = `restaurant-data-${sanitizedName}-${Date.now()}.ts`;
        const filePath = join(dataDir, fileName);

        // Ensure the directory exists
        try {
            await mkdir(dataDir, { recursive: true });
        } catch (err) {
            // Ignore if directory already exists
            const error = err as { code?: string };
            if (error.code !== 'EEXIST') {
                throw err;
            }
        }

        // Format the content as a TypeScript export
        const fileContent = `export const seedData = ${content};\n`;

        // Write to file
        await writeFile(filePath, fileContent, 'utf-8');
        console.log(`Data saved to ${filePath}`);

        // Return both the content and the file path to the client
        return json({
            content: parsedContent,
            savedTo: fileName
        });
    } catch (err) {
        const error = err as Error;
        console.error("Error en /api/process-images:", error);
        return json({ error: error.message }, { status: 500 });
    }
}