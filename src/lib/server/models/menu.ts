import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String },
  price: { type: String },
  description: { type: String }
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  dishes: [dishSchema]
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categories: [categorySchema]
}, {
  timestamps: true
});

export const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema); 