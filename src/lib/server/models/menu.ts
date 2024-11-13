import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  price: String,
  description: String
});

const categorySchema = new mongoose.Schema({
  name: String,
  dishes: [dishSchema]
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema); 