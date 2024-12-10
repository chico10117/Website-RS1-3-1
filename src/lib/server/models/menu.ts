import mongoose from 'mongoose';

// Definir el esquema para los platos
const dishSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  price: String,
  description: String
});

// Definir el esquema para las categorías
const categorySchema = new mongoose.Schema({
  name: String,
  dishes: [dishSchema]
});

// Definir el esquema principal del restaurante
const restaurantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  logo: { 
    type: String,
    required: false,
    default: ''
  },
  categories: [categorySchema]
}, {
  timestamps: true
});

// Verificamos si el modelo ya existe antes de crearlo
export const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema); 