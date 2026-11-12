'use client';

import { FormEvent, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js/pure';
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { SERVER_URL } from '@/lib/constants';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

type Props = {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
};

const StripeForm = ({
  priceInCents,
  orderId,
}: {
  priceInCents: number;
  orderId: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (stripe == null || elements == null || email == null) return;

    setIsLoading(true);

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
        },
      })
      .then(({ error }) => {
        if (
          error?.type === 'card_error' ||
          error?.type === 'validation_error'
        ) {
          setErrorMessage(error?.message ?? 'An unknown error occurred');
        } else if (error) {
          setErrorMessage('An unknown error occurred');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <div className='text-xl'>Stripe Checkout</div>
      {errorMessage && <div className='text-destructive'>{errorMessage}</div>}
      <PaymentElement />
      <div>
        <LinkAuthenticationElement
          onChange={(e) => setEmail(e.value.email)}
        />
      </div>
      <Button
        type='submit'
        className='w-full'
        size='lg'
        disabled={stripe == null || elements == null || isLoading}
      >
        {isLoading
          ? 'Purchasing...'
          : `Purchase ${formatCurrency(priceInCents / 100)}`}
      </Button>
    </form>
  );
};

const StripePayment = ({ priceInCents, orderId, clientSecret }: Props) => {
  const { theme, systemTheme } = useTheme();
  const stripeTheme =
    theme === 'dark'
      ? 'night'
      : theme === 'light'
        ? 'stripe'
        : systemTheme === 'light'
          ? 'stripe'
          : 'night';

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme: stripeTheme,
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm priceInCents={priceInCents} orderId={orderId} />
    </Elements>
  );
};

export default StripePayment;
