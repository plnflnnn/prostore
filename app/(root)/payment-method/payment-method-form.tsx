'use client';
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useTransition } from "react";
import { paymentMethodSchema } from "@/lib/validators";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldSet, FieldTitle, FieldContent } from "@/components/ui/field";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Loader, ArrowRight } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { PaymentMethod } from "@/types";

const PaymentMethodForm = ({ preferredPaymentMethod }: { preferredPaymentMethod: string | null}) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
        },
    });

    const onSubmit = (data: PaymentMethod) => {
        startTransition(async () => {
            const result = await updateUserPaymentMethod(data);
            toast.add({
                title: result.success ? 'Payment method updated successfully' : 'Failed to update payment method',
                type: result.success ? 'success' : 'error',
            });
            router.push('/place-order');
        });
    };

    return (
        <>
        <div className="max-w-md mx-auto space-y-4">
            <h1 className="h2-bold mt-4">Payment Methods</h1>
            <p className="text-sm text-muted-foreground">
                Please select your preferred payment method.
            </p>
                <form method='post' className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col md:flex-row gap-3 w-full">
                    <Controller
                    name="type"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <FieldSet className="w-full">
                            <RadioGroup
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                className="flex flex-col space-y-2 w-full"
                            >
                                {PAYMENT_METHODS.map((method, index) => (
                                    <FieldLabel key={method} htmlFor={`form-rhf-radiogroup-${index}`}>
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldTitle>{method}</FieldTitle>
                                        </FieldContent>
                                        <RadioGroupItem
                                            value={method}
                                            id={`form-rhf-radiogroup-${index}`}
                                            aria-invalid={fieldState.invalid}
                                        />
                                        </Field>
                                    </FieldLabel>
                                ))}
                                </RadioGroup>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </FieldSet>
                    )}
                    />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <ArrowRight className="w-4 h-4 mr-2" />
                            )}
                            Continue
                        </Button>
                    </div>
                </form>
        </div>
        </>
    )
}

export default PaymentMethodForm;