import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { translations } from '$lib/i18n/translations';
import { language } from '$lib/stores/language';
import { get } from 'svelte/store';
import env from '$lib/config/env';

export async function POST({ request }: RequestEvent) {
  const currentLanguage = get(language);
  const t = (key: string) => translations[key][currentLanguage];

  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    
    if (!file) {
      return json({ success: false, error: t('noFileUploaded') }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return json({ success: false, error: t('invalidFileType') }, { status: 400 });
    }

    // Validate file size (max 4MB)
    const maxSize = 4 * 1024 * 1024; // 4MB in bytes
    if (file.size > maxSize) {
      return json({ success: false, error: t('fileTooLarge') }, { status: 400 });
    }

    try {
      // Upload to Vercel Blob Storage with token
      const { url } = await put(file.name, file, {
        access: 'public',
        token: env.BLOB_READ_WRITE_TOKEN
      });

      console.log('File uploaded to Vercel Blob, URL:', url); // Debug log
      
      return json({ 
        success: true, 
        url,
        message: t('fileUploadSuccess')
      });
    } catch (uploadError) {
      console.error('Vercel Blob upload error:', uploadError);
      return json({ 
        success: false, 
        error: t('fileUploadError'),
        details: uploadError instanceof Error ? uploadError.message : 'Upload failed'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing upload request:', error);
    return json({ 
      success: false, 
      error: t('fileUploadError'),
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 