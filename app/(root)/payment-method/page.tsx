import { Suspense } from "react";
import { auth } from "@/auth";
import { Metadata } from "next";
import { getUserById } from "@/lib/actions/user.actions";
import PaymentMethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Payment Method",
  description: "Select Payment Method",
}

async function PaymentMethodContent() {
    const session = await auth();
    const userId = session?.user?.id;
    if(!userId) throw new Error("User not found");
    const user = await getUserById(userId);
    if(!user) throw new Error("User not found");

  return (
    <div>
        <CheckoutSteps current={2} />
        <PaymentMethodForm preferredPaymentMethod={user?.paymentMethod || null} />
    </div>
  )
}

const PaymentMethodPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentMethodContent />
    </Suspense>
  )
}

export default PaymentMethodPage;
