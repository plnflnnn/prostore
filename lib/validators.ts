import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z.string().refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))), 'Price must have exactly two decimal places');

export const insertProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    slug: z.string().min(3, 'Slug must be at least 3 characters long'),
    description: z.string().min(3, 'Description must be at least 3 characters long'),
    price: currency,
    category: z.string().min(1, 'Category is required'),
    brand: z.string().min(1, 'Brand is required'),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    isFeatured: z.boolean().default(false),
    banner: z.string().nullable(),
    //numReviews: z.coerce.number().default(0),
    //rating: z.coerce.number().default(0),
});

export const signInFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const signUpFormSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
    message: `Passwords don't match`,
    path: ['confirmPassword'],
});

//Cart Schemas
export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    image: z.string().min(1, 'Image is required'),
    price: currency,
    quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart ID is required'),
    userId: z.string().optional().nullable(),
});

// Schema for the shipping address
export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 characters long'),
    streetAddress: z.string().min(3, 'Address must be at least 3 characters long'),
    city: z.string().min(3, 'City is required'),
    postalCode: z.string().min(3, 'Postal code is required'),
    country: z.string().min(3, 'Country must be at least 3 characters long'),
    lat: z.number().optional(),
    lng: z.number().optional(),
})