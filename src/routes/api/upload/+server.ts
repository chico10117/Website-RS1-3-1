import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { put } from '@vercel/blob';
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

    // Upload to Vercel Blob Storage
    const { url } = await put(file.name, file, {
      access: 'public',
    });

    console.log('File uploaded to Vercel Blob, URL:', url); // Debug log
    
    return json({ 
      success: true, 
      url,
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