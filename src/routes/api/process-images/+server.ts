import { json } from '@sveltejs/kit';
import OpenAI from "openai";
import { writeFile } from 'fs/promises';
import { join } from 'path';

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

export async function POST({ request }) {
    try {
        // Recibe el payload enviado desde el cliente
        const { prompt, images } = await request.json();
        const contentList = [];

        // Incluye el prompt de texto
        contentList.push({
            type: 'text',
            text: prompt || DEFAULT_PROMPT
        });

        // Para cada imagen, reconstruye el data URL y añade el objeto a la lista
        images.forEach(img => {
            const base64 = img.base64; // Se asume que es la parte sin el prefijo
            contentList.push({
                type: 'image_url',
                image_url: { url: `data:image/png;base64,${base64}` }
            });
        });

        // Envía la petición a la API de OpenAI (se asume que se dispone de un modelo multimodal como "gpt-4o-mini")
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    // Se envía la lista de contenidos (texto + imágenes)
                    content: contentList
                }
            ],
            response_format: {
                "type": "json_object"
            },
            temperature: 0
        });
        
        console.log("Respuesta de OpenAI:", response.choices[0]);
        const content = response.choices[0].message.content;
        console.log("Content before writing:", content);
        
        // Parse the JSON to get restaurant name
        const parsedContent = JSON.parse(content);
        const restaurantName = parsedContent.restaurant?.name || 'unknown';
        const sanitizedName = restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Create the file path with correct directory
        const fileName = `restaurant-data-${sanitizedName}-${Date.now()}.ts`;
        const filePath = join(process.cwd(), 'scripts', 'seed-data', fileName);

        // Format the content as a TypeScript export
        const fileContent = `export const seedData = ${content};\n`;

        // Write to file
        await writeFile(filePath, fileContent, 'utf-8');
        console.log(`Data saved to ${filePath}`);

        // Return both the content and the file path to the client
        return json({
            content: JSON.parse(content),
            savedTo: fileName
        });
    } catch (error) {
        console.error("Error en /api/process-images:", error);
        return json({ error: error.message }, { status: 500 });
    }
}