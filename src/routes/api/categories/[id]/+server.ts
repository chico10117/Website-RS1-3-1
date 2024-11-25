import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { connectDB } from '$lib/server/database';
import { Category } from '$lib/server/models/menu';
import mongoose from 'mongoose';

export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const { id } = params;
        
        console.log('Updating category with ID:', id);
        
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error('Invalid ObjectId format:', id);
            return json({
                success: false,
                error: 'Invalid category ID format'
            }, { status: 400 });
        }

        // Parse and validate request body
        let body;
        try {
            body = await request.json();
        } catch (e) {
            console.error('Error parsing request body:', e);
            return json({
                success: false,
                error: 'Invalid request body'
            }, { status: 400 });
        }

        const { name } = body;

        if (!name || typeof name !== 'string') {
            console.error('Invalid or missing name in request:', body);
            return json({
                success: false,
                error: 'Category name is required and must be a string'
            }, { status: 400 });
        }

        // Connect to database
        await connectDB();

        // Update document using Mongoose
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name },
            { 
                new: true,
                runValidators: true 
            }
        );

        console.log('Database update result:', updatedCategory);

        if (!updatedCategory) {
            console.error('Category not found:', id);
            return json({
                success: false,
                error: 'Category not found'
            }, { status: 404 });
        }

        // Return success response
        return json({
            success: true,
            data: updatedCategory
        });

    } catch (error) {
        console.error('Detailed error updating category:', {
            error: error,
            message: error.message,
            stack: error.stack
        });

        return json({
            success: false,
            error: 'Internal server error: ' + error.message
        }, { status: 500 });
    }
}

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const { id } = params;
        
        console.log('Deleting category with ID:', id);
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return json({
                success: false,
                error: 'Invalid category ID format'
            }, { status: 400 });
        }

        await connectDB();
        
        const deletedCategory = await Category.findByIdAndDelete(id);

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
            error: 'Internal server error: ' + error.message
        }, { status: 500 });
    }
} 