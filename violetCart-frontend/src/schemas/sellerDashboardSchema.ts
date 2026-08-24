import { z } from 'zod';

export const addProductSchema = z.object({
    id: z.string().optional(),
    imageFile: z
        .instanceof(File, { message: 'Image file is required' })
        .refine((file) => file.size > 0, 'Image file cannot be empty')
        .refine((file) => file.size <= 5 * 1024 * 1024, 'Image file size must not exceed 5MB'),
    productName: z
        .string()
        .min(1, 'Product name is required')
        .max(25, 'Product name must not exceed 25 characters'),
    price: z
        .string()
        .min(1, 'Price is required')
        .transform((val) => {
            const num = parseFloat(val);
            if (isNaN(num)) throw new Error('Price must be a valid number');
            return num;
        })
        .refine((val) => val > 0, 'Price must be greater than 0'),
    stocksLeft: z
        .string()
        .min(1, 'Stock quantity is required')
        .transform((val) => {
            const num = parseInt(val, 10);
            if (isNaN(num)) throw new Error('Stock must be a valid integer');
            return num;
        })
        .refine((val) => val >= 0, 'Stock must be a valid non-negative integer'),
    category: z
        .string()
        .min(1, 'Category is required')
        .max(25, 'Category must not exceed 25 characters'),
    description: z
        .string()
        .min(1, 'Description is required')
        .max(255, 'Description must not exceed 255 characters'),
});

export const searchProductSchema = z.object({
    productName: z.string().optional(),
    category: z.string().optional(),
    page: z.number().int().min(0).optional(),
    size: z.number().int().min(1).optional(),
    sort: z.string().optional(),
});

export type AddProductFormInput = z.input<typeof addProductSchema>;
export type AddProductFormData = z.output<typeof addProductSchema>;

export type SearchProductFormInput = z.input<typeof searchProductSchema>;
export type SearchProductFormData = z.output<typeof searchProductSchema>;