import { Suspense } from "react";
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getMyCart } from '@/lib/actions/cart.action';
import { ShippingAddress } from '@/types';
import { Metadata } from 'next';
import { getUserById } from '@/lib/actions/user.actions';
import ShippingAddressForm from './shipping-address-form';
import CheckoutSteps from '@/components/shared/checkout-steps';
import Loading from '@/app/loading';

export const metadata: Metadata = {
  title: 'Shipping Address'
}

async function ShippingAddressContent() {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) {
    redirect('/cart');
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await getUserById(userId);

  return (
    <>
        <CheckoutSteps current={1}/>
        <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  )
}

const ShippingAddressPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ShippingAddressContent />
    </Suspense>
  )
}

export default ShippingAddressPage;
