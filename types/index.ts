import { z } from 'zod';
import { insertProductSchema, insertCartSchema, cartItemSchema, shippingAddressSchema } from '@/lib/validators';

export type Product =  z.infer<typeof insertProductSchema> & {
    id: string;
    rating: string;
    numReviews: number;
    createdAt: Date;
    updatedAt: Date;
    stock: number;
};

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof insertCartSchema> & {
    id: string;
};

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;