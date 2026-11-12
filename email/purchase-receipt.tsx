import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from 'react-email';

type PurchaseReceiptEmailProps = {
  order: {
    id: string;
    createdAt: Date | string;
    totalPrice: string;
    taxPrice: string;
    shippingPrice: string;
    itemsPrice: string;
    orderItems: {
      productId: string;
      name: string;
      quantity: number;
      image: string;
      price: string;
    }[];
  };
};

const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

function formatCurrency(amount: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

export default function PurchaseReceiptEmail({
  order,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading>Purchase Receipt</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                    Order ID
                  </Text>
                  <Text className='mt-0 mr-4'>{order.id.toString()}</Text>
                </Column>
                <Column>
                  <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                    Purchase Date
                  </Text>
                  <Text className='mt-0 mr-4'>
                    {dateFormatter.format(new Date(order.createdAt))}
                  </Text>
                </Column>
                <Column>
                  <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                    Price Paid
                  </Text>
                  <Text className='mt-0 mr-4'>
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className='border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4'>
              {order.orderItems.map((item) => (
                <Row key={item.productId} className='mt-8'>
                  <Column className='w-20'>
                    <Img
                      width='80'
                      alt={item.name}
                      className='rounded'
                        src={
                            item.image.startsWith('/')
                            ? `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${item.image}`
                            : item.image
                        }
                    />
                  </Column>
                  <Column className='align-top'>
                    {item.name} x {item.quantity}
                  </Column>
                  <Column align='right' className='align-top'>
                    {formatCurrency(item.price)}
                  </Column>
                </Row>
              ))}
              {[
                { name: 'Items', price: order.itemsPrice },
                { name: 'Tax', price: order.taxPrice },
                { name: 'Shipping', price: order.shippingPrice },
                { name: 'Total', price: order.totalPrice },
              ].map(({ name, price }) => (
                <Row key={name} className='py-1'>
                  <Column align='right'>{name}: </Column>
                  <Column align='right' width={70} className='align-top'>
                    <Text className='m-0'>{formatCurrency(price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export const purchaseReceiptPreviewProps = {
  order: {
    id: '11111111-1111-4111-8111-111111111111',
    createdAt: '2024-01-15T12:00:00.000Z',
    totalPrice: '100.00',
    taxPrice: '10.00',
    shippingPrice: '10.00',
    itemsPrice: '80.00',
    orderItems: [
      {
        productId: '123',
        name: 'Polo Sporting Stretch Shirt',
        quantity: 1,
        image: '/images/sample-products/p1-1.jpg',
        price: '59.99',
      },
    ],
  },
} satisfies PurchaseReceiptEmailProps;

PurchaseReceiptEmail.PreviewProps = purchaseReceiptPreviewProps;
