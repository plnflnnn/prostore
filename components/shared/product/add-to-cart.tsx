'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Loader } from 'lucide-react';
import { CartItem, Cart } from '@/types';
import { toast } from '@/components/ui/toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action';
import { useTransition } from 'react';

const AddToCart = ({ cart, item }: {cart?: Cart, item: CartItem}) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleAddToCart = async () => {
        startTransition(async () => {
            const res = await addItemToCart(item);
            if (res.success) {
                toast.add({
                    title: `${item.name} added to cart`,
                    description: res.message,
                    type: 'success',
                    actionProps: {
                        children: 'Go To Cart',
                        className: 'bg-primary text-white hover:bg-gray-800',
                        onClick: () => router.push('/cart'),
                    },
                });
            } else {
                toast.add({
                    type: 'error',
                    title: 'Failed to add item to cart',
                    description: res.message,
                })
            }
        });
    }

    // Remove item from cart
    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const res = await removeItemFromCart(item.productId);
            toast.add({
                type: res.success ? 'success' : 'error',
                title: `${item.name} removed from cart`,
                description: res.message,
            });
        });
    }

    // Check if item is in cart
    const existItem = cart?.items.find((x: CartItem) => x.productId === item.productId);

    return existItem ? (
        <div className='flex items-center justify-center mt-5'>
            <Button variant='outline' type='button' onClick={handleRemoveFromCart}>
                {isPending ? (
                    <Loader className='h-4 w-4 animate-spin'/>
                ) : (
                    <Minus className='h-4 w-4'/>
                )}
            </Button>
            <span className='px-2'>{existItem.quantity}</span>
            <Button variant='outline' type='button' onClick={handleAddToCart}>
                {isPending ? (
                    <Loader className='h-4 w-4 animate-spin'/>
                ) : (
                    <Plus className='h-4 w-4'/>
                )}
            </Button>
        </div>
    ) : (
        <Button className='w-full' type='button' onClick={handleAddToCart}>
            {isPending ? (
                <Loader className='h-4 w-4 animate-spin'/>
            ) : (
                <Plus className='h-4 w-4'/>
            )}
            Add to Cart
        </Button>
    )


}

export default AddToCart;