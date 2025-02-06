# Seed Data Guidelines

## Dish Title Naming Conventions

### General Rules
1. Always use complete, descriptive names that would work well in image generation prompts
2. Include the category type in the title when relevant
3. Use proper capitalization
4. Include size or quantity information when applicable

### Examples

❌ **Incorrect Naming**
```
"Margarita"
"Kebab Normal"
"Durum"
"Nuggets"
```

✅ **Correct Naming**
```
"Pizza Margarita Clásica"
"Kebab de Ternera"
"Durum de Pollo"
"Nuggets de Pollo"
```

## Image to Text Processing

### Menu Image Processing Guidelines

1. **Text Extraction**
   - Use OCR (Optical Character Recognition) to extract text from menu images
   - Manually verify and correct any OCR errors
   - Pay special attention to:
     - Special characters
     - Price formatting
     - Menu item numbering
     - Descriptions and ingredients

2. **Structure Preservation**
   - Maintain the original menu's category structure
   - Preserve item numbering if present
   - Keep price formats consistent

3. **Additional Information**
   - Document any visual elements that could be relevant:
     - Menu layout
     - Special highlights
     - Featured items
     - Visual categorization

### Example of Image to Text Processing

Original Menu Item:
```
🌟 14. KEBAB ........................ 4.50€
    (Carne, ensalada, salsas)
```

Should be processed as:
```typescript
{
  title: "Kebab Tradicional de Carne con Ensalada Fresca",
  price: "4.50",
  description: "Delicioso kebab con carne tierna, ensalada fresca y salsas caseras",
  allergens: [],
  featured: true  // Based on the star symbol
}
```

## Best Practices

1. **Descriptions**
   - Include detailed descriptions that help with image generation
   - Mention key ingredients and preparation methods
   - Use appetizing adjectives appropriately

2. **Categorization**
   - Use clear, hierarchical category names
   - Maintain consistency across similar items
   - Group related items logically

3. **Special Features**
   - Document any special markers (vegetarian, spicy, etc.)
   - Include size variations when applicable
   - Note promotional or featured items

4. **Data Validation**
   - Verify all prices are correctly formatted
   - Ensure all required fields are filled
   - Check for consistency in naming conventions

## DALL-E Prompt Optimization

When titles will be used for DALL-E image generation, ensure they include:

1. **Visual Elements**
   - Main ingredients
   - Presentation style
   - Garnishes or accompaniments

2. **Descriptive Details**
   - Cooking method
   - Texture descriptions
   - Color information

3. **Context**
   - Type of cuisine
   - Traditional elements
   - Serving style
