import { z } from 'zod';
import { insertProductSchema, insertCartSchema, cartItemSchema, shippingAddressSchema, paymentMethodSchema, insertOrderSchema, insertOrderItemSchema, paymentResultSchema, updateUserProfileSchema, updateUserSchema } from '@/lib/validators';

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
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
    id: string;
    createdAt: Date;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    orderItems: OrderItem[];
    user: { name: string; email: string; };
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type UserProfile = z.infer<typeof updateUserProfileSchema>;

export type SalesDataType = { month: string; totalSales: number }[];

export type InsertProductData = z.infer<typeof insertProductSchema>;

export type UpdateUserData = z.infer<typeof updateUserSchema>;