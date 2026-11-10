import { Metadata } from "next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auth } from "@/auth";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { PAGE_SIZE } from "@/lib/constants";
import { formatId, formatDateAndTime, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";

export const metadata: Metadata = {
  title: "Admin Orders",
};

const AdminOrdersPageContent = async({searchParams}: {searchParams: Promise<{page: string}>}) => {
    const { page } = await searchParams;
    const session = await auth();
    if(session?.user?.role !== 'admin') {
        throw new Error("User is not authorized");
    }
    const { data, totalPages } = await getAllOrders({limit: PAGE_SIZE, page: Number(page) || 1});
    return(
        <div className="space-y-2">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="">
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
                    <Button variant="outline" size="sm">
                      <Link href={`/orders/${order.id}`}>Details</Link>
                    </Button>
                    <DeleteDialog id={order.id} action={deleteOrder} />
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

const AdminOrdersPage = ({searchParams}: {searchParams: Promise<{page: string}>}) => {
  return (
    <Suspense fallback={<Loading/>}>
      <AdminOrdersPageContent searchParams={searchParams} />
    </Suspense>
  )
}

export default AdminOrdersPage;