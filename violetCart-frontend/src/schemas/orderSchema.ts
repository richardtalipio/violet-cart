import { z } from 'zod';

// Reusable phone regex consistent with your auth schemas
const phoneRegex = /^[0-9+\s-]{7,15}$/;

export const paymentMethodSchema = z.enum(['ONLINE', 'COD'], {
    errorMap: () => ({ message: 'Please select a valid payment method' }),
});

export const shippingAddressSchema = z.object({
    fullName: z
        .string()
        .min(1, 'Recipient name is required')
        .max(100, 'Name must not exceed 100 characters'),
    phone: z
        .string()
        .min(1, 'Phone number is required')
        .regex(phoneRegex, 'Please enter a valid phone number'),
    street: z
        .string()
        .min(1, 'Street address is required')
        .max(255, 'Street address must not exceed 255 characters'),
    city: z
        .string()
        .min(1, 'City is required')
        .max(100, 'City must not exceed 100 characters'),
    province: z
        .string()
        .min(1, 'Province is required')
        .max(100, 'Province must not exceed 100 characters'),
    postalCode: z
        .string()
        .min(1, 'Postal code is required')
        .max(20, 'Postal code must not exceed 20 characters'),
});

export const checkoutItemSchema = z.object({
    productId: z.number().positive('Invalid product ID'),
    productName: z.string().min(1, 'Product name is required'),
    storeProfileId: z.number().positive('Invalid store profile'),
    imageUrl: z.string().nullable().optional(),
    price: z.number().positive('Price must be greater than 0'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const checkoutSchema = z.object({
    customerName: z.string().min(1, 'Customer name is required'),
    paymentMethod: paymentMethodSchema,
    shippingAddress: shippingAddressSchema,
    shippingFee: z.number().min(0, 'Shipping fee cannot be negative'),
    items: z
        .array(checkoutItemSchema)
        .min(1, 'Your cart must contain at least one item to check out'),
});

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
export const orderSearchSchema = z.object({
    customerName: z.string().optional(),
    orderStatus: z.string().optional(),
    userAccountId: z.number().optional(),
    page: z.number().int().min(0).optional().default(0),
    size: z.number().int().min(1).optional().default(10),
    sort: z.string().optional().default('orderDate,DESC'),
});

export type OrderSearchFormData = z.infer<typeof orderSearchSchema>;
export type OrderSearchFormInput = z.input<typeof orderSearchSchema>;
export type CheckoutItemFormData = z.infer<typeof checkoutItemSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;