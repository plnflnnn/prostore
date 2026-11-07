'use server';
import { cookies } from 'next/headers';
import { Cart, CartItem } from '@/types';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { Prisma } from '@/lib/generated/prisma/client';
import { convertToPlainObject, formatErrors, round2 } from '@/lib/utils';
import { cartItemSchema, insertCartSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';
import { connection } from 'next/server';

//Calculate cart prices
const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
    );
    const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2)
    };
}

const toJsonItems = (items: CartItem[]) => items as unknown as Prisma.InputJsonValue[];

export async function addItemToCart(data: CartItem) {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Cart session not found');

        const session = await auth();
        const userId = session?.user?.id ? session.user.id : undefined;

        const cart = await getMyCart();
        const item = cartItemSchema.parse(data);

        const product = await prisma.product.findUnique({
            where: { id: item.productId },
        });

        if (!product) throw new Error('Product not found');

        if (!cart) {
            const newCart = insertCartSchema.parse({
                userId,
                sessionCartId,
                items: [item],
                ...calcPrice([item]),
            });

            await prisma.cart.create({
                data: {
                    ...newCart,
                    items: toJsonItems(newCart.items),
                },
            });

            revalidatePath(`/product/${product.slug}`);
            revalidatePath('/cart');

            return { success: true, message: `${product.name} added to cart` };
        }

        const existItem = cart.items.find((x) => x.productId === item.productId);

        if (existItem) {
            if (product.stock < existItem.quantity + 1) {
                throw new Error(`Not enough stock`);
            }
            cart.items = cart.items.map((x) =>
                x.productId === item.productId
                    ? { ...x, quantity: x.quantity + 1 }
                    : x
            );
        } else {
            if (product.stock < item.quantity) throw new Error('Not enough stock');
            cart.items.push(item);
        }

        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: toJsonItems(cart.items),
                ...calcPrice(cart.items),
            },
        });

        revalidatePath(`/product/${product.slug}`);
        revalidatePath('/cart');

        return {
            success: true,
            message: `${product.name} ${existItem ? 'updated in' : 'added to'} cart`,
        };
    } catch (error) {
        return { success: false, message: formatErrors(error) };
    }
}

export async function getMyCart() {
    await connection();
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    const session = await auth();
    const userId = session?.user?.id ? session.user.id : undefined;

    const cart = await prisma.cart.findFirst({
        where: userId ? { userId } : { sessionCartId },
    });

    if (!cart) return undefined;

    return convertToPlainObject<Cart>({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    });
}

export async function removeItemFromCart(productId: string) {
    try{
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Cart session not found');

        const product = await prisma.product.findFirst({
            where: {id: productId}
        });

        if(!product) throw new Error('Product not found');

        //Get user cart
        const cart = await getMyCart();
        if(!cart) throw new Error('Cart not found');

        // Check for item
        const exist = cart.items.find((x: CartItem) => x.productId === productId);
        if(!exist) throw new Error('Item not found in cart');

        // Remove the line when quantity is 1 (or already invalid); otherwise decrement
        if (exist.quantity <= 1) {
            cart.items = cart.items.filter((x) => x.productId !== productId);
        } else {
            cart.items = cart.items.map((x) =>
                x.productId === productId
                    ? { ...x, quantity: x.quantity - 1 }
                    : x
            );
        }

        cart.items = cart.items.filter((x) => x.quantity >= 1);

        //Save to database
        await prisma.cart.update({
            where: {id: cart.id},
            data: {
                items: toJsonItems(cart.items),
                ...calcPrice(cart.items)
            }
        });

        revalidatePath(`/product/${product.slug}`);
        revalidatePath('/cart');

        return {
            success: true,
            message: `${product.name} was removed from cart`
        };
    } catch(error) {
        return { success: false, message: formatErrors(error) };
    }
}