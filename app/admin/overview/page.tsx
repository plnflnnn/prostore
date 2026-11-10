import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, Barcode, ShoppingBag, Users } from "lucide-react";
import { formatCurrency, formatDateAndTime, formatNumber } from "@/lib/utils";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Charts from "./charts";
import Loading from "@/app/loading";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Admin Overview",
};

const AdminOverviewPageContent = async () => {
    const session = await auth();
    if(session?.user?.role !== 'admin') {
        throw new Error("User is not authorized");
    };
    const summary = await getOrderSummary();

    return (
        <div className='space-y-2'>
            <h1 className='h2-bold'>Dashboard</h1>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
                        <BadgeDollarSign />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {formatCurrency(summary.totalSales)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Sales</CardTitle>
                        <ShoppingBag />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {formatNumber(summary.ordersCount)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Customers</CardTitle>
                        <Users />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {formatNumber(summary.usersCount)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Products</CardTitle>
                        <Barcode />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {formatNumber(summary.productsCount)}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                <Card className='col-span-4'>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Charts
                            data={{
                                salesData: summary.salesData,
                            }}
                        />
                    </CardContent>
                </Card>
                <Card className='col-span-3'>
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>BUYER</TableHead>
                                    <TableHead>DATE</TableHead>
                                    <TableHead>TOTAL</TableHead>
                                    <TableHead>ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summary.latestSales.map((order) => (
                                    <TableRow key={order.id}>
                                    <TableCell>
                                        {order?.user?.name ? order.user.name : 'Deleted User'}
                                    </TableCell>
                                    <TableCell>
                                        {formatDateAndTime(order.createdAt).dateOnly}
                                    </TableCell>
                                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                                    <TableCell>
                                        <Link href={`/order/${order.id}`}>
                                        <span className='px-2'>Details</span>
                                        </Link>
                                    </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
      </div>
    )
}

const AdminOverviewPage = () => {
    return (
        <Suspense fallback={<Loading/>}>
            <AdminOverviewPageContent />
        </Suspense>
    )
}

export default AdminOverviewPage;