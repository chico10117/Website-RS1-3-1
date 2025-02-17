import { json } from '@sveltejs/kit';
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST({ request }) {
    try {
        // Recibe el payload enviado desde el cliente
        const { prompt, images } = await request.json();
        const contentList = [];

        // Incluye el prompt de texto
        contentList.push({
            type: 'text',
            text: prompt || "Analiza las imagenes que te adjunto, la cuales contiene la carta de un restaurante. Extrae y organiza la información de la siguiente forma:\n\n- Identifica las categorías o secciones de la carta (por ejemplo: Entradas, Platos Principales, Postres, Bebidas). Trata de utilizar todo el contenido visible de la imagen, no dejes nada sin procesar que esté relacionado a platos de la carta\n- Para cada categoría, extrae los nombres de los platos y sus respectivos precios.\n- Si hay descripciones adicionales, inclúyelas en el campo \"descripcion\".\n\nDevuelve la información en formato JSON exactamente sin explicaciones adicionales. Por ejemplo, el formato de salida debe ser similar a:\n\n{\n  restaurant: {\n    name: 'Burger',\n    description: 'all relevant data from restaurant on image'\n  },\n  \"categories\": [\n    {\n      \"name\": \"Entradas\",\n      \"dishes\": [\n        {\n          \"title\": \"Ensalada César\",\n          \"description\": \"Con pollo, lechuga y crutones\",\n          \"price\": \"10.00\"\n        },\n        {\n          \"title\": \"Sopa de Mariscos\",\n          \"price\": \"12.50\"\n        }\n      ]\n    },\n    {\n      \"name\": \"Platos Principales\",\n      \"dishes\": [\n        {\n          \"title\": \"Filete de Res\",\n          \"price\": \"20.00\"\n        }\n      ]\n    }\n  ]\n}"
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
        // Devuelve la respuesta en formato JSON
        return json(response.choices[0].message.content);
    } catch (error) {
        console.error("Error en /api/process-images:", error);
        return json({ error: error.message }, { status: 500 });
    }
}