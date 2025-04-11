import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../src/lib/server/schema';
import { eq, sql } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch'; // Use node-fetch or global fetch if available

dotenv.config(); // Load environment variables from .env file

const DATABASE_URL = process.env.DATABASE_URL;
const TARGET_RESTAURANT_ID = '97924ffc-43f5-483b-befc-80a04c486590';
const OUTPUT_DIR = path.resolve(process.cwd(), 'downloaded_dish_images');

if (!DATABASE_URL) {
	console.error('Error: DATABASE_URL environment variable not set.');
	process.exit(1);
}

// --- Translation Map ---
const titleTranslationMap: { [key: string]: string } = {
	// Existing translations
	'宫保虾': 'Gambas_Gong_Bao',
	'红酒牛肋骨': 'Costillas_Ternera_Vino_Tinto',
	// Added translations from log
	'铁板鸡': 'Pollo_Plancha_Caliente',
	'菠萝鸡': 'Pollo_Pina',
	'泰式咖喱鸡': 'Pollo_Curry_Tailandes',
	'里脊牛肉': 'Solomillo_Ternera',
	'双冬牛肉': 'Ternera_Setas_Bambu',
	'椒盐龙虾': 'Langosta_Sal_Pimienta',
	'葱油鲈鱼': 'Lubina_Aceite_Cebolleta',
	'水煮鱼': 'Pescado_Hervido_Picante',
	'柠檬鸡': 'Pollo_Limon',
	'双冬鸡': 'Pollo_Setas_Bambu',
	'玉米烤': 'Maiz_Asado',
	'虾卷': 'Rollo_Gambas',
	'蔬菜炒鸡': 'Pollo_Salteado_Verduras',
	'越南春卷': 'Rollito_Vietnamita',
	'日式牛肉沙拉': 'Ensalada_Ternera_Japonesa',
	'蒜香排骨': 'Costillas_Ajo',
	'素春卷': 'Rollito_Vegetal',
	'锅贴': 'Gyozas_Plancha',
	'蜜汁排骨': 'Costillas_Miel',
	'芝麻球': 'Bolas_Sesamo',
	'点心混合': 'Dim_Sum_Variado',
	'麻婆豆腐': 'Mapo_Tofu',
	'海草沙拉': 'Ensalada_Algas',
	'烧麦': 'Siu_Mai',
	'锅巴酸甜': 'Arroz_Crujiente_Agridulce',
	'水果捞': 'Sopa_Frutas',
	'黄牛排': 'Chuleta_Ternera_Amarilla',
	'芹菜虾': 'Gambas_Apio',
	'牛肉炒河粉': 'Ternera_Salteada_Ho_Fun',
	'宫保鸡丁': 'Pollo_Gong_Bao',
	'天富罗虾': 'Tempura_Gambas',
	'家常豆腐': 'Tofu_Casero',
	'肉夹馍': 'Pan_Carne_Chino',
	'三鲜炒饭': 'Arroz_Frito_Tres_Delicias',
	'日式炸鸡翅': 'Alitas_Pollo_Fritas_Japonesas',
	'本店特色沙拉': 'Ensalada_Especial_Casa',
	'天富罗蔬菜': 'Tempura_Verduras',
	'港式烤生蚝': 'Ostras_Asadas_Hong_Kong',
	'牛肉拉面': 'Ramen_Ternera',
	'鸭丝炒饭': 'Arroz_Frito_Pato_Desmenuzado',
	'海鲜拉面': 'Ramen_Marisco',
	'排骨拉面': 'Ramen_Costillas',
	'三鲜炒粉干': 'Fideos_Arroz_Salteados_Tres_Delicias',
	'牛肉炒面': 'Tallarines_Salteados_Ternera',
	'双冬虾': 'Gambas_Setas_Bambu',
	'泰式咖喱蟹': 'Cangrejo_Curry_Tailandes',
	'泰式 冬功阴汤': 'Sopa_Tom_Yum_Kung_Tailandesa', // Note: Key includes the space
	'酸辣汤': 'Sopa_Agripicante',
	'小笼包': 'Xiao_Long_Bao',
	'铁板沙茶牛肉': 'Ternera_Plancha_Salsa_Satay',
	'日式豆豉河鳗': 'Anguila_Soja_Negra_Japonesa',
	'海带豆芽': 'Algas_Brotes_Soja',
	'东河肉饼': 'Torta_Carne_Donghe',
	'松鼠鲈鱼': 'Lubina_Ardilla',
	'东坡肉块': 'Panceta_Dongpo',
	'铁板大虾': 'Gambas_Plancha_Caliente',
	'广式虾仁肠粉': 'Cheung_Fun_Gambas_Cantones',
	'炸香芋': 'Taro_Frito',
	'海鲜锅巴': 'Arroz_Crujiente_Marisco',
	'蔬菜牛肉': 'Ternera_Verduras',
	'北京烤鸭': 'Pato_Laqueado_Pekin',
	'虾饺': 'Har_Gow',
	'鱼香中国茄子': 'Berenjena_China_Yu_Xiang',
	'和牛排': 'Chuleta_Wagyu',
	'哈密瓜': 'Melon_Hami',
	'蒜蓉扇贝': 'Vieiras_Ajo',
	'水果沙拉': 'Ensalada_Frutas',
	'甜酸鱼块': 'Pescado_Agridulce',
	'水煮牛肉': 'Ternera_Hervida_Picante',
	'毛豆夹': 'Edamame',
};
// ---------------------

// --- Database Setup ---
const pool = new pg.Pool({
	connectionString: DATABASE_URL
});
const db = drizzle(pool, { schema });
// ---------------------

// Helper function to sanitize filenames
function sanitizeFilename(name: string): string {
	// Remove strictly forbidden characters
	let sanitized = name.replace(/[\\/:*?"<>|]/g, '');
	// Replace spaces with underscores
	sanitized = sanitized.replace(/\s+/g, '_');
	// Collapse multiple underscores
	sanitized = sanitized.replace(/_+/g, '_');
	// Trim leading/trailing underscores
	sanitized = sanitized.replace(/^_+|_+$/g, '');
	// Limit length (optional)
	return sanitized.substring(0, 100); // Limit to 100 chars
}

// Helper function to get extension from URL
function getExtensionFromUrl(imageUrl: string): string | null {
	try {
		const url = new URL(imageUrl);
		const pathname = url.pathname;
		const ext = path.extname(pathname);
		return ext && ext.length > 1 ? ext.toLowerCase() : null; // Ensure it's a valid extension like .jpg
	} catch (error) {
		console.warn(`Could not parse URL to get extension: ${imageUrl}`);
		return null;
	}
}

async function downloadImages() {
	console.log(`Starting image download for restaurant ID: ${TARGET_RESTAURANT_ID}`);
	console.log(`Output directory: ${OUTPUT_DIR}`);

	try {
		// 1. Create output directory if it doesn't exist
		await fs.mkdir(OUTPUT_DIR, { recursive: true });

		// 2. Query dishes for the specific restaurant
		console.log('Querying database for dishes...');
		const dishes = await db
			.select({
				title: schema.dishes.title,
				imageUrl: schema.dishes.imageUrl
			})
			.from(schema.dishes)
			.innerJoin(schema.categories, eq(schema.dishes.categoryId, schema.categories.id))
			.where(eq(schema.categories.restaurantId, TARGET_RESTAURANT_ID));

		console.log(`Found ${dishes.length} dishes associated with the restaurant.`);

		if (dishes.length === 0) {
			console.log('No dishes found for this restaurant. Exiting.');
			return;
		}

		// 3. Download images
		let downloadedCount = 0;
		let skippedCount = 0;

		for (const dish of dishes) {
			if (!dish.imageUrl || !dish.title) {
				console.warn(`Skipping dish: Missing title or image URL. Title: ${dish.title || '(missing)'}`);
				skippedCount++;
				continue;
			}

			console.log(`Processing dish: "${dish.title}" - Image URL: ${dish.imageUrl}`);

			try {
				const response = await fetch(dish.imageUrl);
				if (!response.ok) {
					console.error(`	Failed to fetch image for "${dish.title}". Status: ${response.status} ${response.statusText}`);
					skippedCount++;
					continue;
				}

				// Get image data as ArrayBuffer, then convert to Buffer
				const arrayBuffer = await response.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);

				// Determine filename - Check translation map first
				const baseTitle = titleTranslationMap[dish.title] || dish.title;
				const sanitizedTitle = sanitizeFilename(baseTitle);
				let extension = getExtensionFromUrl(dish.imageUrl);

				if (!extension) {
					// Attempt to get extension from Content-Type header
					const contentType = response.headers.get('content-type');
					if (contentType?.startsWith('image/')) {
						extension = '.' + contentType.split('/')[1];
					} else {
						console.warn(`	Could not determine file extension for "${dish.title}". Skipping.`);
						skippedCount++;
						continue;
					}
				}

				const filename = `${sanitizedTitle}${extension}`;
				const outputPath = path.join(OUTPUT_DIR, filename);

				// Save the image
				await fs.writeFile(outputPath, buffer);
				console.log(`	Successfully downloaded and saved: ${filename}`);
				downloadedCount++;

			} catch (fetchError: any) {
				console.error(`	Error downloading image for "${dish.title}" (${dish.imageUrl}):`, fetchError.message || fetchError);
				skippedCount++;
			}
		}

		console.log('\nDownload process finished.');
		console.log(`	Successfully downloaded: ${downloadedCount}`);
		console.log(`	Skipped/Errors: ${skippedCount}`);

	} catch (error: any) {
		console.error('\nAn unexpected error occurred during the download process:', error);
	} finally {
		// 4. Close the database connection
		await pool.end();
		console.log('Database connection closed.');
	}
}

// Run the script
downloadImages(); 