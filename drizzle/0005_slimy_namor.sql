ALTER TABLE "restaurants" ALTER COLUMN "color" SET DEFAULT '#85A3FA';--> statement-breakpoint
CREATE INDEX "category_restaurant_id_idx" ON "categories" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "category_order_idx" ON "categories" USING btree ("restaurant_id","order");--> statement-breakpoint
CREATE INDEX "dish_category_id_idx" ON "dishes" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "dish_order_idx" ON "dishes" USING btree ("category_id","order");--> statement-breakpoint
CREATE INDEX "restaurant_user_id_idx" ON "restaurants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "restaurant_slug_idx" ON "restaurants" USING btree ("slug");