'use client';
import { Cart } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import {ArrowRight, Loader, Minus, Plus} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const CartTable = ({cart}: {cart?: Cart}) => {

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // const handleRemoveItem = (itemId: string) => {
    //     startTransition(async () => {
    //         await removeItemFromCart(itemId);
    //     });
    // }

    // const handleAddItem = (itemId: string) => {
    //     startTransition(async () => {
    //         await addItemToCart(itemId);
    //     });
    // }

  return (
    <>
        <h1 className="py-4 h2-bold">Shopping Cart</h1>
        {!cart || cart.items.length === 0 ? (
            <div>
                Cart is empty. <Link href="/">Go Shopping</Link>
            </div>
        ): (
            <div className="grid md:grid-cols-4 md:gap-5">
                <div className="overflow-x-auto md:col-span-3">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.items.map((item) => (
                                <TableRow key={item.productId}>
                                    <TableCell>
                                        <Link href={`/products/${item.slug}`} className="flex items-center gap-2">
                                            <Image src={item.image} alt={item.name} width={50} height={50} />
                                            <span className='px-2'>{item.name}</span>
                                        </Link>
                                    </TableCell>
                                    <TableCell className='flex-center gap-2'>
                                        <Button
                                            disabled={isPending} variant='outline' type='button'
                                            onClick={() =>  startTransition(async () => {
                                                const res = await removeItemFromCart(item.productId);
                                                toast.add({
                                                    type: res.success ? 'success' : 'error',
                                                    description: res.message,
                                                });
                                                router.refresh();
                                            })}>
                                            {isPending ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Minus className="w-4 h-4" />
                                            )}
                                        </Button>
                                        <span className="px-2">{item.quantity}</span>
                                        <Button
                                            disabled={isPending} variant='outline' type='button'
                                            onClick={() =>  startTransition(async () => {
                                                const res = await addItemToCart(item);
                                                toast.add({
                                                    type: res.success ? 'success' : 'error',
                                                    description: res.message,
                                                });
                                                router.refresh();
                                            })}>
                                            {isPending ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Plus className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-right">${item.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Card>
                    <CardContent className='p-4 gap-4'>
                        <div className="pb-3 text-xl">
                            Subtotal ({cart.items.reduce((a, c) => a + c.quantity, 0)})
                            <span className="font-bold">
                                {formatCurrency(cart.itemsPrice)}
                            </span>
                        </div>
                        <Button disabled={isPending} variant='default' type='button' className='w-full' onClick={() => startTransition(() => {
                            router.push('/shipping-address');
                        })}>
                            {isPending ? (
                                <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                                <ArrowRight className="w-4 h-4" />
                            )}
                            Proceed to Checkout
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )}
    </>
  )
}

export default CartTable;