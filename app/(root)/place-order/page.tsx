import { Suspense } from "react";
import { Metadata } from "next";
import { getMyCart } from "@/lib/actions/cart.actions";
import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Link from "next/link";
import CheckoutSteps from "@/components/shared/checkout-steps";
import Loading from "@/app/loading";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import PlaceOrderForm from "./place-order-form";

export const metadata: Metadata = {
    title: 'Place Order',
}

async function PlaceOrderContent() {
    const cart = await getMyCart();
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error('User not found');
    if(!cart || cart.items.length === 0) redirect('/cart');

    const user = await getUserById(userId);
    if(!user.address) redirect('/shipping-address');

    type UserAddress = {
        fullName: string;
        streetAddress: string;
        city: string;
        postalCode: string;
        country: string;
    }
    const userAddress = user.address as UserAddress;

    return (
        <>
            <CheckoutSteps current={3} />
                <h1 className="h2-bold mt-4">Place Order</h1>
                <div className="grid md:grid-cols-3 gap-5">
                    <div className="md:col-span-2 space-y-4">
                        <Card>
                            <CardContent className="p-4 gap-4">
                                <h2 className="text-xl pb-4">
                                    Shipping Address
                                </h2>
                                <p>{userAddress.fullName}</p>
                                <p>{userAddress.streetAddress}, {userAddress.city}, {userAddress.postalCode}, {userAddress.country}</p>
                                <div className="mt-3">
                                    <Link href="/shipping-address">
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 gap-4">
                                <h2 className="text-xl pb-4">
                                    Payment method
                                </h2>
                                <p>{user.paymentMethod}</p>
                                <div className="mt-3">
                                    <Link href="/payment-method">
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 gap-4">
                                <h2 className="text-xl pb-4">
                                    Order Items
                                </h2>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cart.items.map((item) => (
                                            <TableRow key={item.productId}>
                                                <TableCell className="flex items-center gap-2">
                                                    <Link href={`/product/${item.slug}`}>
                                                        <Image src={item.image} alt={item.name} width={50} height={50} />
                                                    </Link>
                                                    <span>{item.name}</span>
                                                </TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right">{item.price}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-3">
                                    <Link href="/cart">
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardContent className="p-4 gap-4 space-y-4">
                                <div className="flex justify-between">
                                    <div>Items</div>
                                    <div>{formatCurrency(cart.itemsPrice)}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div>Tax</div>
                                    <div>{formatCurrency(cart.taxPrice)}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div>Shipping</div>
                                    <div>{formatCurrency(cart.shippingPrice)}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div>Total</div>
                                    <div>{formatCurrency(cart.totalPrice)}</div>
                                </div>
                                <PlaceOrderForm />
                            </CardContent>
                        </Card>
                </div>
            </div>
        </>

    )
}

const PlaceOrderPage = () => {
    return (
        <Suspense fallback={<Loading />}>
            <PlaceOrderContent />
        </Suspense>
    )
}

export default PlaceOrderPage;
