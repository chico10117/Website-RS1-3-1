import {json} from '@sveltejs/kit';
import OpenAI from "openai";
import type {ChatCompletionContentPart} from 'openai/resources/chat/completions';
import type { RequestEvent } from '@sveltejs/kit';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Configuration constants
const MAX_IMAGES_PER_REQUEST = 8; // Limit the number of images to send to OpenAI
const STREAM_PROGRESS_INTERVAL_MS = 1000; // How often to send progress updates

const DEFAULT_PROMPT = `Por favor, devuelve tu respuesta estrictamente en formato JSON. Analiza las imagenes que te adjunto, la cuales contiene la carta de un restaurante. Extrae y organiza la información de la siguiente forma:
    
    - Identifica las categorías o secciones de la carta (por ejemplo: Entradas, Platos Principales, Postres, Bebidas). Trata de utilizar todo el contenido visible de la imagen, no dejes nada sin procesar que esté relacionado a platos de la carta
    - Para cada categoría, extrae los nombres de los platos y sus respectivos precios.
    - Si hay descripciones adicionales, inclúyelas en el campo "description".
    - Para los precios, utiliza el formato numérico (ejemplo: 10.00) sin símbolos de moneda.
    - Es CRÍTICO que cada plato tenga un título (title) y un precio (price).
    - Si no puedes determinar el precio, usa 0.00 como valor predeterminado.
    - Si no identificas el nombre intenta crear uno corto basado en la informacion que aparece en la tabla
    - IMPORTANTE: Para el número de teléfono, devuelve SOLO los dígitos sin espacios ni caracteres especiales (ejemplo: 34123456789)
    
    Devuelve la información estrictamente en formato JSON. El formato de salida debe ser exactamente como este ejemplo:
    
    {
      "restaurant": {
        name: "Nombre del restaurante",
        logo: "",
        customPrompt: "",
        currency: "€",
        phoneNumber: 34123456789,
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
        const startTime = Date.now();
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

        // Sort images by page number to ensure correct order
        const sortedImages = [...images].sort((a, b) => a.page - b.page);
        
        // Limit the number of images to process (to avoid excessive API usage)
        let processedImages: ImageData[];
        if (sortedImages.length > MAX_IMAGES_PER_REQUEST) {
            console.log(`Limiting request to ${MAX_IMAGES_PER_REQUEST} images (received ${sortedImages.length})`);
            processedImages = sortedImages.slice(0, MAX_IMAGES_PER_REQUEST);
        } else {
            processedImages = sortedImages;
        }

        // Calculate total size of base64 data being sent
        const totalBase64Length = processedImages.reduce((sum, img) => sum + img.base64.length, 0);
        console.log(`Total image data size: ${(totalBase64Length / (1024 * 1024)).toFixed(2)}MB`);

        const contentList: ChatCompletionContentPart[] = [
            {
                type: 'text' as const,
                text: prompt || DEFAULT_PROMPT
            },
            ...processedImages.map((img: ImageData) => ({
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
                    role: "system",
                    content: "You are an assistant designed to extract information from images and respond strictly in JSON format."
                },
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
                    // Set up a timer to send periodic updates to keep the connection alive
                    // and provide the user with feedback that processing is happening
                    let processStartTime = Date.now();
                    let lastUpdateTime = Date.now();
                    let chunkCount = 0;
                    let isFirstChunk = true;
                    
                    const progressInterval = setInterval(() => {
                        const currentTime = Date.now();
                        const elapsedSecs = (currentTime - processStartTime) / 1000;
                        
                        // Only send status updates if we haven't received data in a while
                        if (currentTime - lastUpdateTime > STREAM_PROGRESS_INTERVAL_MS) {
                            let statusMessage = '';
                            
                            if (elapsedSecs < 5) {
                                statusMessage = 'Starting analysis...';
                            } else if (elapsedSecs < 15) {
                                statusMessage = 'Analyzing menu content...';
                            } else if (elapsedSecs < 30) {
                                statusMessage = 'Processing menu sections...';
                            } else {
                                statusMessage = 'Extracting detailed information...';
                            }
                            
                            controller.enqueue(encoder.encode(`data: [PROGRESS] ${statusMessage}\n\n`));
                        }
                    }, STREAM_PROGRESS_INTERVAL_MS);
                    
                    try {
                        for await (const chunk of stream) {
                            if (chunk.choices && chunk.choices[0].delta?.content) {
                                const text = chunk.choices[0].delta.content;
                                generatedAnswer += text;
                                
                                // Update timing info
                                lastUpdateTime = Date.now();
                                chunkCount++;
                                
                                // For the first chunk, send a notification that processing has started
                                if (isFirstChunk) {
                                    controller.enqueue(encoder.encode(`data: [START] Processing has begun\n\n`));
                                    isFirstChunk = false;
                                }
                                
                                // Every few chunks, send a loading update to keep the connection alive
                                if (chunkCount % 5 === 0) {
                                    controller.enqueue(encoder.encode(`data: [LOADING]\n\n`));
                                }
                            }
                        }
                        
                        clearInterval(progressInterval);
                        
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
                                error: parseError,
                                contentPreview: generatedAnswer.substring(0, 200) + '...'
                            });
                            throw new Error('Failed to parse OpenAI response: Invalid JSON format');
                        }

                        console.log('Content parsed successfully:', {
                            hasRestaurant: !!parsedContent.restaurant,
                            categoriesCount: parsedContent.categories?.length,
                            userEmail: parsedContent.userEmail,
                            totalTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`
                        });

                        controller.enqueue(encoder.encode(`data: [DONE]${JSON.stringify(parsedContent)}`));
                    } catch (streamError) {
                        clearInterval(progressInterval);
                        console.error('Error processing OpenAI stream:', streamError);
                        controller.enqueue(encoder.encode(`data: [ERROR]${JSON.stringify({error: 'Processing error'})}\n\n`));
                    } finally {
                        controller.close();
                    }
                }
            }),
            {headers: {'Content-Type': 'text/event-stream'}}
        );

    } catch (error) {
        console.error('Error en el procesamiento de imágenes:', error);
        return json({error: 'Error procesando la solicitud'}, {status: 500});
    }
}