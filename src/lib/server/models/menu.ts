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
}, {
  timestamps: true
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema); 