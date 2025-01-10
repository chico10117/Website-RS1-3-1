import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const { id } = params;
        const body = await request.json();
        const { name } = body;

        if (!name || typeof name !== 'string') {
            return json({
                success: false,
                error: 'Category name is required and must be a string'
            }, { status: 400 });
        }

        const [updatedCategory] = await db.update(categories)
            .set({ name, updatedAt: new Date() })
            .where(eq(categories.id, id))
            .returning();

        if (!updatedCategory) {
            return json({
                success: false,
                error: 'Category not found'
            }, { status: 404 });
        }

        return json({
            success: true,
            data: updatedCategory
        });

    } catch (error) {
        console.error('Error updating category:', error);
        return json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const { id } = params;
        
        const [deletedCategory] = await db.delete(categories)
            .where(eq(categories.id, id))
            .returning();

        if (!deletedCategory) {
            return json({
                success: false,
                error: 'Category not found'
            }, { status: 404 });
        }

        return json({
            success: true,
            data: deletedCategory
        });

    } catch (error) {
        console.error('Error deleting category:', error);
        return json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        }, { status: 500 });
    }
}; 