'use client';

import { createOrder } from "@/lib/actions/order.actions";
import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition, type SubmitEvent } from "react";
import { toast } from "@/components/ui/toast";

const PlaceOrderForm = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        startTransition(async () => {
            const response = await createOrder();
            if (response.redirectTo) {
                router.push(response.redirectTo);
                return;
            }
            if (!response.success) {
                toast.add({
                    type: 'error',
                    title: 'Could not place order',
                    description: response.message,
                });
            }
        });
    }

    return (
        <form onSubmit={onSubmit} className='w-full'>
            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <Check className="w-4 h-4 mr-2" />
                )}
                Place Order
            </Button>
        </form>
    )
}

export default PlaceOrderForm;
