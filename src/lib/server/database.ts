// Importaciones necesarias
import mongoose from 'mongoose';
import { MONGODB_URI } from '$env/static/private';

// Variable para mantener la conexión en caché
let cached = global.mongoose;

// Inicialización del objeto cache si no existe
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // Si ya existe una conexión, la retornamos
  if (cached.conn) {
    console.log('Using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Connecting to MongoDB...', MONGODB_URI);
    const opts = {
      bufferCommands: false,
    };

    // Creamos la promesa de conexión
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connected to MongoDB!');
      return mongoose;
    });
  }

  try {
    // Esperamos a que se resuelva la promesa y guardamos la conexión
    cached.conn = await cached.promise;
  } catch (e) {
    console.error('Error connecting to MongoDB:', e);
    cached.promise = null;
    throw e;
  }

  // Retornamos la conexión establecida
  // Retornamos la conexión establecida
  return cached.conn;
} 