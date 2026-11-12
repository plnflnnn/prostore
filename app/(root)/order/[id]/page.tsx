import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/loading";
import OrderDetailaTable from "./order-details-table";
import { auth } from "@/auth";
import Stripe from 'stripe';

export const metadata: Metadata = {
  title: 'Order Details',
}

async function OrderInfo({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await getOrderById(id);
    if(!order) {
        notFound();
    }
    const session = await auth();
    const paypalClientId = process.env.PAYPAL_CLIENT_ID || 'sb';

    let stripeClientSecret = null;
    //Check if is not paid and using stripe
    if(!order.isPaid && order.paymentMethod === 'Stripe') {
      //Init stripe instance
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
      //Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount:  Math.round(Number(order.totalPrice) * 100),
        currency: 'usd',
        metadata: { orderId: order.id },
      });
      stripeClientSecret = paymentIntent.client_secret;
    }

    return (
        <OrderDetailaTable
          order={order}
          paypalClientId={paypalClientId}
          isAdmin={session?.user?.role === 'admin' || false}
          stripeClientSecret={stripeClientSecret || null}
        />
    )
}

const OrderDetailPage = (props: { params: Promise<{ id: string }> }) => {
  return (
    <Suspense fallback={<Loading />}>
      <OrderInfo params={props.params} />
    </Suspense>
  )
}

export default OrderDetailPage;
