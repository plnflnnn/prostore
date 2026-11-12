import { connection } from 'next/server';
import { render } from 'react-email';
import PurchaseReceiptEmail, {
  purchaseReceiptPreviewProps,
} from '@/email/purchase-receipt';

export default async function EmailPreviewPage() {
  await connection();
  const html = await render(
    <PurchaseReceiptEmail {...purchaseReceiptPreviewProps} />
  );

  return (
    <iframe
      title='Purchase receipt preview'
      srcDoc={html}
      className='min-h-screen w-full border-0 bg-white'
    />
  );
}
