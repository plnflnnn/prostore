'use client';
import { Order } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatDateAndTime, formatCurrency, formatId } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import {
    PayPalProvider,
    PayPalOneTimePaymentButton,
    usePayPal,
    INSTANCE_LOADING_STATE,
    type OnApproveDataOneTimePayments,
} from "@paypal/react-paypal-js/sdk-v6";
import { createPaypalOrder, approvePaypalOrder, updateOrderToPaidCOD, deliverOrder } from "@/lib/actions/order.actions";
import { toast } from "@/components/ui/toast";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import StripePayment from "./stripe-payment";


type Props ={
    order: Omit<Order, "paymentResult">,
    paypalClientId: string,
    isAdmin: boolean,
    stripeClientSecret: string | null
}

const OrderDetailaTable = ({order, paypalClientId, isAdmin, stripeClientSecret}: Props) => {

    const {
        id,
        shippingAddress,
        orderItems,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentMethod,
        isDelivered,
        isPaid,
        paidAt,
        deliveredAt,
        taxPrice
    } = order;

    const handlePaypalCreateOrder = async () => {
        const res = await createPaypalOrder(id);
        if (!res.success || !res.data) {
            throw new Error(res.message);
        }
        return { orderId: String(res.data) };
    };

    const handlePaypalApprove = async ({ orderId }: OnApproveDataOneTimePayments) => {
        const res = await approvePaypalOrder(id, { orderId });
        if (!res.success) {
            toast.add({ type: "error", description: res.message });
            return;
        }
        toast.add({ type: "success", description: res.message });
    };

    const [isPending, startTransition] = useTransition();

    const handleDeliverOrder = async () => {
        const res = await deliverOrder(id);
        toast.add({
            type: res.success ? "success" : "error",
            description: res.message
        });
    };

    const handleUpdateOrderToPaidCOD = () => {
        startTransition(async () => {
            const res = await updateOrderToPaidCOD(id);
            toast.add({
                type: res.success ? "success" : "error",
                description: res.message
            });
        });
    };


    return (
    <>
        <PayPalProvider
            clientId={paypalClientId}
            environment="sandbox"
            components={["paypal-payments"]}
            pageType="checkout"
        >
        <div className="mx-auto space-y-4">
            <h1 className="h2-bold mt-4">Order {formatId(order.id)}</h1>
            <div className="grid md:grid-cols-3 gap-5">
                <div className="flex flex-col col-span-2 space-4-y gap-4">
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="h3-bold">Payment Method</h2>
                            <p className="pb-2">{paymentMethod}</p>
                            {isPaid ? (
                                <Badge variant="secondary">
                                    Paid at {formatDateAndTime(paidAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant="destructive">
                                    Not paid
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="h3-bold">Shipping Address</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p className="pb-2">
                                {shippingAddress.streetAddress}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                            {isDelivered ? (
                                <Badge variant="secondary">
                                    Delivered at {formatDateAndTime(deliveredAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant="destructive">
                                    Not delivered
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="h3-bold">Shipping Address</h2>
                            <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orderItems.map((item) => (
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
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className="p-4 gap-4 space-y-4">
                            <div className="flex justify-between">
                                <div>Items</div>
                                <div>{formatCurrency(itemsPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Tax</div>
                                <div>{formatCurrency(taxPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Shipping</div>
                                <div>{formatCurrency(shippingPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total</div>
                                <div>{formatCurrency(totalPrice)}</div>
                            </div>
                            {!isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
                                <StripePayment priceInCents={Math.round(Number(totalPrice) * 100)} orderId={id} clientSecret={stripeClientSecret} />
                            )}
                            {!isPaid && paymentMethod === 'PayPal' && (
                                <>
                                    <PrintLoadingState />
                                    <PayPalOneTimePaymentButton
                                        presentationMode="auto"
                                        createOrder={handlePaypalCreateOrder}
                                        onApprove={handlePaypalApprove}
                                        onError={(error) => {
                                            toast.add({
                                                type: "error",
                                                description: error.message,
                                            });
                                        }}
                                    />
                                </>
                            )}

                            {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                                <Button
                                    type="button"
                                    onClick={handleUpdateOrderToPaidCOD}
                                    disabled={isPending}
                                >
                                    {isPending ? 'Processing...' : 'Mark as paid'}
                                </Button>
                            )}
                            {isAdmin && !isDelivered && isPaid && (
                                <Button type="button"
                                onClick={handleDeliverOrder}
                                disabled={isPending}>
                                    {isPending ? 'Processing...' : 'Mark as delivered'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
        </PayPalProvider>
    </>
  )
};

const PrintLoadingState = () => {
    const { loadingStatus, error } = usePayPal();
    const isPending = loadingStatus === INSTANCE_LOADING_STATE.PENDING;
    const isRejected = loadingStatus === INSTANCE_LOADING_STATE.REJECTED;

    if (isPending) return <div>Loading PayPal...</div>;
    if (isRejected) return <div>Error Loading PayPal: {error?.message}</div>;
    return <div>PayPal Loaded</div>;
};

export default OrderDetailaTable;