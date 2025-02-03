import OpenAI from 'openai';
import { put } from '@vercel/blob';
import * as dotenv from 'dotenv';

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
      return `A complete ${title} ${description}, served on a rustic wooden board with sides and garnishes visible. Wide shot showing the entire plate and surrounding table setting. Captured from a 3/4 overhead angle to show the full composition. Natural lighting with soft shadows. Professional food photography style with the entire dish in frame.`;
    
    case 'drink':
      return `A full view of ${title} ${description}, served in an elegant glass with accompanying garnishes and ice. Wide composition showing the entire glass and surrounding bar setting. Shot from a slight side angle to capture the full presentation. Professional beverage photography with the complete drink in frame.`;
    
    case 'restaurant':
      return `A minimalist and modern logo design for ${title} restaurant. The logo should feature a stylized burger icon with clean lines and professional typography. Use a color palette of warm browns and rich reds. The design should be simple enough to be recognizable at small sizes. The logo should be centered on a white background with plenty of padding. Professional branding style with high contrast and clear shapes.`;
    
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
