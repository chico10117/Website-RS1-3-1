import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST({ request }: RequestEvent) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    
    if (!file) {
      return json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Crear directorio de uploads si no existe
    const uploadsDir = join(process.cwd(), 'static', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generar nombre único para el archivo
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(uploadsDir, fileName);

    // Guardar el archivo
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    // Devolver la URL completa del archivo
    const fileUrl = `/uploads/${fileName}`;
    console.log('File saved, returning URL:', fileUrl); // Debug log
    
    return json({ 
      success: true, 
      url: fileUrl,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return json({ 
      success: false, 
      error: error.message,
      details: error 
    }, { status: 500 });
  }
} 