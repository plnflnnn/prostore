import { getOrdersForUser } from "@/lib/actions/order.actions";
import { PAGE_SIZE } from "@/lib/constants";
import { Metadata } from "next";
import { formatCurrency, formatDateAndTime, formatId } from "@/lib/utils";
import Link from "next/link";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Suspense } from "react";
import Loading from "@/app/loading";
import Pagination from "@/components/shared/pagination";

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Orders page',
}

const OrdersPageContent = async (props: {searchParams: Promise<{page: string}>}) => {
  const { page } = await props.searchParams;
  const {data, totalPages} = await getOrdersForUser({limit: PAGE_SIZE, page: Number(page) || 1});
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ORDER ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>{formatDateAndTime(order.createdAt).dateTime}</TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>{order.isPaid && order.paidAt ? formatDateAndTime(order.paidAt).dateTime : 'No'}</TableCell>
                <TableCell>{order.isDelivered && order.deliveredAt ? formatDateAndTime(order.deliveredAt).dateTime : 'No'}</TableCell>
                <TableCell>
                  <Link href={`/orders/${order.id}`} className="text-blue-500 hover:text-blue-700">Details</Link>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No orders found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && <Pagination page={Number(page) || 1} totalPages={totalPages} urlParamName="page" />}
      </div>
    </div>
  )
}


const OrdersPage = async (props: {searchParams: Promise<{page: string}>}) => {
  return (
    <Suspense fallback={<Loading />}>
      <OrdersPageContent searchParams={props.searchParams} />
    </Suspense>
  )
}

export default OrdersPage;