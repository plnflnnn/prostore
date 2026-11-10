import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/loading";
import OrderDetailaTable from "./order-details-table";
import { auth } from "@/auth";

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

    return (
        <OrderDetailaTable order={order} paypalClientId={paypalClientId} isAdmin={session?.user?.role === 'admin' || false}/>
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
