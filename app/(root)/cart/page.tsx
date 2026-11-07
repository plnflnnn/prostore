import { Suspense } from "react";
import { Metadata } from "next";
import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.action";
import Loading from "@/app/loading";

export const metadata: Metadata = {
    title: 'Shopping Cart',
    description: 'View your shopping cart and checkout',
}

async function CartContent() {
  const cart = await getMyCart();
  return <CartTable cart={cart}/>;
}

const CartPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CartContent />
    </Suspense>
  )
}

export default CartPage;
