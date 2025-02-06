import OpenAI from 'openai';
import { put } from '@vercel/blob';
import * as dotenv from 'dotenv';
import pLimit from 'p-limit';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function generatePrompt(title: string, description: string, type: 'food' | 'drink' | 'restaurant'): string {
  switch (type) {
    case 'food':
      return `A gourmet ${title} ${description}, artfully presented on a rustic wooden board. Captured from a 45-degree angle to highlight the textures and layers of the dish. Background features a blurred view of a cozy, ambient-lit restaurant setting. Illuminated with soft, natural lighting to accentuate the freshness of ingredients. In a hyper-realistic photographic style.`;
    
    case 'drink':
      return `A full view of ${title} ${description}, served in an elegant glass with accompanying garnishes and ice. Wide composition showing the entire glass and surrounding bar setting. Shot from a slight side angle to capture the full presentation. Professional beverage photography with the complete drink in frame and hyper-realistic style.`;
  
    case 'restaurant':
      return `A minimalist and modern logo design for ${title} restaurant. The logo should feature a stylized icon with clean lines and professional typography. Use a color palette of warm browns and rich reds. The design should be simple enough to be recognizable at small sizes. The logo should be centered on a white background with plenty of padding. Professional branding style with high contrast and clear shapes.`;
    
    default:
      return `A professional photograph of ${title}. ${description}. Captured in a hyper-realistic style with perfect lighting and composition.`;
  }
}

export async function generateAndStoreImage(
  title: string,
  description: string,
  type: 'food' | 'drink' | 'restaurant'
): Promise<string> {
  try {
    const prompt = generatePrompt(title, description, type);
    console.log('🎨 Generating image with prompt:', prompt);

    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt,
      n: 1,
      size: "256x256",
      quality: "standard"
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('No image URL received from OpenAI');
    }

    // Download the image and upload to Vercel Blob
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    
    const filename = `${title.toLowerCase().replace(/[^\w]/g, '-')}-${Date.now()}.png`;
    const blob = await put(filename, imageBlob, {
      access: 'public',
      addRandomSuffix: true
    });

    console.log('✅ Image generated and stored:', blob.url);
    return blob.url;

  } catch (error) {
    console.error('Error generating image:', error);
    // Return a default image URL based on type
    return getDefaultImage(type);
  }
}

function getDefaultImage(type: 'food' | 'drink' | 'restaurant'): string {
  switch (type) {
    case 'food':
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
    case 'drink':
      return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd';
    case 'restaurant':
      return 'https://images.unsplash.com/photo-1552566626-52f8b828add9';
    default:
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
  }
}

interface ImageGenerationTask {
  title: string;
  description: string;
  type: 'food' | 'drink' | 'restaurant';
}

export async function generateBatchImages(
  tasks: ImageGenerationTask[],
  concurrency: number = 3
): Promise<Record<string, string>> {
  const limit = pLimit(concurrency);
  const results: Record<string, string> = {};

  try {
    const promises = tasks.map(task => 
      limit(async () => {
        try {
          const [imageUrl] = await generateAndStoreImage(
            task.title,
            task.description,
            task.type
          );
          console.log(`✅ Generated image for ${task.title}`);
          return { title: task.title, url: imageUrl };
        } catch (error) {
          console.error(`Failed to generate image for ${task.title}:`, error);
          return { title: task.title, url: getDefaultImage(task.type) };
        }
      })
    );

    const completedTasks = await Promise.all(promises);
    completedTasks.forEach(task => {
      results[task.title] = task.url;
    });

    return results;
  } catch (error) {
    console.error('Batch processing error:', error);
    return tasks.reduce((acc, task) => {
      acc[task.title] = getDefaultImage(task.type);
      return acc;
    }, {} as Record<string, string>);
  }
} 
