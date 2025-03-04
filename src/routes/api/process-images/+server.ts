import {json} from '@sveltejs/kit';
import OpenAI from "openai";
import type {ChatCompletionContentPart} from 'openai/resources/chat/completions';
import type { RequestEvent } from '@sveltejs/kit';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_PROMPT = `Analiza las imagenes que te adjunto, la cuales contiene la carta de un restaurante. Extrae y organiza la información de la siguiente forma:
    
    - Identifica las categorías o secciones de la carta (por ejemplo: Entradas, Platos Principales, Postres, Bebidas). Trata de utilizar todo el contenido visible de la imagen, no dejes nada sin procesar que esté relacionado a platos de la carta
    - Para cada categoría, extrae los nombres de los platos y sus respectivos precios.
    - Si hay descripciones adicionales, inclúyelas en el campo "description".
    - Para los precios, utiliza el formato numérico (ejemplo: 10.00) sin símbolos de moneda.
    - Es CRÍTICO que cada plato tenga un título (title) y un precio (price).
    - Si no puedes determinar el precio, usa 0.00 como valor predeterminado.
    - Si no identificas el nombre intenta crear uno corto basado en la informacion que aparece en la tabla
    Devuelve la información en formato JSON bexactamente como el texto de abajo encerrado entre <json>  y  </json>
    Por ejemplo, el formato de salida debe ser similar a:
    
    {
      "restaurant": {
        name: "Nombre del restaurante",
        logo: "",
        customPrompt: "",
        currency: "€",
        phoneNumber: "+34 123 456 789",
        description: "Descripción del restaurante y toda la información relevante como horarios, ubicación, etc."
      },
      categories: [
        {
          name: "Entradas",
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
              allergens: ["gluten"],
              portions: "200gr"
            }
          ]
        }
      ]
    }
    </json>
    `;

interface ImageData {
    page: number;
    base64: string;
}

interface RequestData {
    prompt?: string;
    images: ImageData[];
}

export async function POST({ request, locals }: RequestEvent) {
    try {
        console.log('Starting process-images...');

        // Get the current user from locals
        const user = locals.user;
        
        if (!user) {
            return json({ error: 'User not authenticated' }, { status: 401 });
        }

        console.log('Processing request for user:', user.email);

        const {prompt, images}: RequestData = await request.json();
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
                image_url: {url: `data:image/png;base64,${img.base64}`}
            }))
        ];
        console.log('Prepared content for OpenAI:', {
            contentListLength: contentList.length,
            promptLength: (prompt || DEFAULT_PROMPT).length
        });

        console.log('Sending request to OpenAI...');
        const stream = await openai.chat.completions.create({
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
            stream: true,
            store: true,
            temperature: 0
        });

        console.log('OpenAI request sent successfully');
        const encoder = new TextEncoder();
        let generatedAnswer = '';
        return new Response(
            new ReadableStream({
                async start(controller) {
                    for await (const chunk of stream) {
                        if (chunk.choices && chunk.choices[0].delta?.content) {
                            const text = chunk.choices[0].delta.content;
                            generatedAnswer += text;
                            controller.enqueue(encoder.encode(`data: [LOADING]\n\n`));
                        }
                    }
                    let parsedContent = null;
                    try {
                        parsedContent = JSON.parse(generatedAnswer);
                        
                        // Add user information to the response
                        if (parsedContent && typeof parsedContent === 'object') {
                            // Ensure we have a restaurant object
                            if (!parsedContent.restaurant) {
                                parsedContent.restaurant = {};
                            }
                            
                            // Add user email to the response
                            parsedContent.userEmail = user.email;
                        }
                        
                    } catch (parseError) {
                        console.error('Failed to parse OpenAI response:', {
                            content: parsedContent,
                            error: parseError
                        });
                        throw new Error('Failed to parse OpenAI response: Invalid JSON format');
                    }

                    console.log('Content parsed successfully:', {
                        hasRestaurant: !!parsedContent.restaurant,
                        categoriesCount: parsedContent.categories?.length,
                        userEmail: parsedContent.userEmail
                    });

                    controller.enqueue(encoder.encode(`data: [DONE]${JSON.stringify(parsedContent)}`));
                    controller.close();
                }
            }),
            {headers: {'Content-Type': 'text/event-stream'}}
        );

    } catch (error) {
        console.error('Error en el procesamiento de imágenes:', error);
        return json({error: 'Error procesando la solicitud'}, {status: 500});
    }
}