import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];

export const baseProductSchema = z.object({
    imageFile: z
        .custom<File | undefined>()
        .refine(
            (file) => !file || (file instanceof File && file.size > 0),
            'Image file cannot be empty'
        )
        .refine(
            (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
            'Image file size must not exceed 5MB'
        )
        .refine(
            (file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
            'Only image files are allowed (JPEG, PNG, GIF, WebP, BMP)'
        ),
    productName: z
        .string()
        .min(1, 'Product name is required')
        .max(25, 'Product name must not exceed 25 characters'),
    price: z
        .string()
        .min(1, 'Price is required')
        .transform((val) => {
            const num = parseFloat(val);
            if (isNaN(num)) {
                throw new Error('Price must be a valid number');
            }
            return num;
        })
        .refine((val) => val > 0, 'Price must be greater than 0'),
    stocksLeft: z
        .string()
        .min(1, 'Stock quantity is required')
        .transform((val) => {
            const num = parseInt(val, 10);
            if (isNaN(num)) {
                throw new Error('Stock must be a valid integer');
            }
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

export const addProductSchema = baseProductSchema.refine(
    (data) => data.imageFile instanceof File,
    {
        message: 'Image file is required',
        path: ['imageFile'],
    }
);

export const editProductSchema = baseProductSchema;

export type AddProductFormData = z.infer<typeof addProductSchema>;
export type EditProductFormData = z.infer<typeof editProductSchema>;