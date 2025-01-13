import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { translations } from '$lib/i18n/translations';
import { language } from '$lib/stores/language';
import { get } from 'svelte/store';

export async function POST({ request }: RequestEvent) {
  const currentLanguage = get(language);
  const t = (key: string) => translations[key][currentLanguage];

  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    
    if (!file) {
      return json({ success: false, error: t('noFileUploaded') }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'static', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(uploadsDir, fileName);

    // Save the file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    // Return the complete file URL
    const fileUrl = `/uploads/${fileName}`;
    console.log('File saved, returning URL:', fileUrl); // Debug log
    
    return json({ 
      success: true, 
      url: fileUrl,
      message: t('fileUploadSuccess')
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return json({ 
      success: false, 
      error: t('fileUploadError'),
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 