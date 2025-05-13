-- Add index on restaurants.userId (Foreign Key)
CREATE INDEX IF NOT EXISTS idx_restaurants_user_id 
ON restaurants (user_id);

-- Add index on categories.restaurantId (Foreign Key)
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_id 
ON categories (restaurant_id);

-- Add index on dishes.categoryId (Foreign Key)
CREATE INDEX IF NOT EXISTS idx_dishes_category_id 
ON dishes (category_id);

-- Add composite index for categories.order (optimize ordering)
CREATE INDEX IF NOT EXISTS idx_categories_order 
ON categories (restaurant_id, "order");

-- Add composite index for dishes.order (optimize ordering)
CREATE INDEX IF NOT EXISTS idx_dishes_order 
ON dishes (category_id, "order");

-- Analyze tables to update statistics for the query planner
ANALYZE restaurants;
ANALYZE categories;
ANALYZE dishes; 