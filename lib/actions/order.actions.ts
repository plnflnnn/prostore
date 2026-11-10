'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatErrors } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { prisma } from "@/db/prisma";
import { connection } from 'next/server';
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { Order, ShippingAddress, PaymentResult, SalesDataType } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";

// Create an order and create the order items
export async function createOrder() {
    try {
        await connection();
        const session = await auth();
        if(!session?.user) {
            throw new Error('User is not authenticated');
        }
        const userId = session.user.id;
        const cart = await getMyCart();

        if(!cart || cart.items.length === 0) {
            return {success: false, message: 'Cart is empty', redirectTo: '/cart'};
        }
        if(!userId) throw new Error('User not found');

        const user = await getUserById(userId);

        if(!user.address) {
            return {success: false, message: 'No shipping address', redirectTo: '/shipping-address'};
        }
        if(!user.paymentMethod) {
            return {success: false, message: 'No payment method', redirectTo: '/payment-method'};
        }

        // Create order object

        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });
        const insertedOrderId = await prisma.$transaction(async (tx) => {
            const insertedOrder = await tx.order.create({ data: order });
            for (const item of cart.items) {
                await tx.orderItem.create({
                    data: {
                        orderId: insertedOrder.id,
                        productId: item.productId,
                        name: item.name,
                        quantity: item.quantity,
                        image: item.image,
                        price: item.price,
                    },
                });
            }

            await tx.cart.update({
                where: { id: cart.id },
                data: {
                    items: [],
                    totalPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    itemsPrice: 0,
                },
            });

            return insertedOrder.id;
        });

        if (!insertedOrderId) throw new Error('Failed to create order');
        return {
            success: true,
            message: 'Order created',
            redirectTo: `/order/${insertedOrderId}`
        };
    } catch (error) {
        if(isRedirectError(error)) {
            throw error;
        }
        return {success: false, message: formatErrors(error)};
    }
};

//Get order by id
export async function getOrderById(orderId: string): Promise<Order | undefined> {
    await connection();
    const data = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderItems: true,
            user: { select: { name: true, email: true }},
        }
    });

    if (!data) return undefined;

    return convertToPlainObject<Order>({
        ...data,
        shippingAddress: data.shippingAddress as ShippingAddress,
        user: {
            name: data.user?.name ?? "",
            email: data.user?.email ?? "",
        },
    });
};

//Create new paypal order
export async function createPaypalOrder(orderId: string) {
    try{
        await connection();
        const order = await prisma.order.findFirst({
            where: { id: orderId}
        });
        if(!order) throw new Error('Order not found');

        //Create paypal order
        const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

        //Update order with paypal order id
        await prisma.order.update({
            where: { id: orderId },
            data: { paymentResult: { id: paypalOrder.id, email: '', status: '', pricePaid: 0 } },
        });

        return {success: true, message: 'Paypal order created', data: paypalOrder.id};
    } catch(error) {
        return {success: false, message: formatErrors(error)};
    }
};

//Approve paypal order and update order
export async function approvePaypalOrder(orderId: string, data: {orderId: string}) {
    try{
        await connection();
        const order = await prisma.order.findFirst({
            where: { id: orderId }
        });
        if(!order) throw new Error('Order not found');

        const captureData = await paypal.capturePayment(data.orderId);
        if(!captureData || captureData.status !== 'COMPLETED' || captureData.id !== (order.paymentResult as PaymentResult)?.id) {
            throw new Error('Failed to capture payment');
        }

        //Update order to paid
        await updateOrderToPaid({
            orderId,
            paymentResult: {
                id: captureData.id,
                status: captureData.status,
                email_address: captureData.payer.email_address,
                pricePaid: captureData.purchase_units[0]?.payments?.captures?.[0]?.amount?.value,
            }
        });

        revalidatePath(`/order/${orderId}`);
        return {success: true, message: 'Your order has been paid'};
    }
    catch(error) {
        return {success: false, message: formatErrors(error)};
    }
};

//Update order
async function updateOrderToPaid({orderId, paymentResult}: {orderId: string, paymentResult?: PaymentResult}) {
    const order = await prisma.order.findFirst({
        where: { id: orderId },
        include: { orderItems: true }
    });
    if(!order) throw new Error('Order not found');
    if(order.isPaid) throw new Error('Order already paid');

    //Transaction to update order and product stock
    await prisma.$transaction(async (tx) => {
        //Iterate over products and update stock
        for (const item of order.orderItems) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }
        //Update order to paid
        await tx.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                paidAt: new Date(),
                paymentResult,
            },
        });

    });

    //Get updated order
    const updatedOrder = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderItems: true,
            user: { select: { name: true, email: true }},
        },
    });
    if(!updatedOrder) throw new Error('Failed to update order');
}

//Get orders for user
export async function getOrdersForUser({limit = PAGE_SIZE, page = 1}: {limit?: number, page: number}) {
    await connection();
    const session = await auth();
    if(!session) {
        throw new Error('User is not authenticated');
    }
    const userId = session.user.id;
    const data = await prisma.order.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
    });
    const dataCount = await prisma.order.count({ where: { userId: userId } });
    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    };
};


//Get sales data and order summary
export async function getOrderSummary() {
    await connection();
    const session = await auth();
    if(!session) {
        throw new Error('User is not authenticated');
    }

    //Get counts for each resource
    const ordersCount = await prisma.order.count();
    const productsCount = await prisma.product.count();
    const usersCount = await prisma.user.count();

    // Calculate the total sales
    const totalSales = await prisma.order.aggregate({
        _sum: { totalPrice: true}
    });

    // Get Monthly Sales. Prisma cannot groupBy a formatted date.
    const orders = await prisma.order.findMany({
        select: { createdAt: true, totalPrice: true },
        orderBy: { createdAt: "asc" },
    });

    const totalsByMonth = new Map<string, number>();
    for (const order of orders) {
        const month = order.createdAt.toLocaleString("en-US", {
            month: "2-digit",
            year: "2-digit",
        });
        totalsByMonth.set(month, (totalsByMonth.get(month) ?? 0) + Number(order.totalPrice));
    }
    const salesData: SalesDataType = [...totalsByMonth.entries()].map(
        ([month, totalSales]) => ({ month, totalSales }),
    );

    //Get latest sales
    const latestSales = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true }},
        },
        take: 6
    });

    return {
        ordersCount,
        productsCount,
        usersCount,
        totalSales: Number(totalSales._sum.totalPrice?.toString() ?? 0),
        salesData,
        latestSales,
    };
};

// Get all orders
export async function getAllOrders({limit = PAGE_SIZE, page }: {limit?: number; page: number;}) {

    const data = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        include: { user: { select: { name: true } } },
    });

    const dataCount = await prisma.order.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    };
};

// Delete an order
export async function deleteOrder(id: string) {
    try {
      await prisma.order.delete({ where: { id } });
      revalidatePath('/admin/orders');

      return {success: true, message: 'Order deleted successfully' };
    } catch (error) {
      return { success: false, message: formatErrors(error) };
    }
};

// Update COD order to paid
export async function updateOrderToPaidCOD(orderId: string) {
    try {
        await updateOrderToPaid({ orderId });
        revalidatePath(`/order/${orderId}`);
        return { success: true, message: 'Order marked as paid' };
    } catch (error) {
        return { success: false, message: formatErrors(error) };
    }
};

// Update COD order to delivered
export async function deliverOrder(orderId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
            },
        });

        if (!order) throw new Error('Order not found');
        if (!order.isPaid) throw new Error('Order is not paid');

        await prisma.order.update({
            where: { id: orderId },
            data: {
                isDelivered: true,
                deliveredAt: new Date(),
            },
        });
        
        revalidatePath(`/order/${orderId}`);
        return {success: true, message: 'Order has been marked delivered',};
    } catch (error) {
        return { success: false, message: formatErrors(error) };
    }
  }