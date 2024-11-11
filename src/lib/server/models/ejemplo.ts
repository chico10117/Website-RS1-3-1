import mongoose from 'mongoose';

const ejemploSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

// Verifica si el modelo ya existe antes de crearlo
export const Ejemplo = mongoose.models.Ejemplo || mongoose.model('Ejemplo', ejemploSchema); 