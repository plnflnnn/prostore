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