import { generateAccessToken, paypal } from '../lib/paypal';

//Test to generate access token from paypal
test('generates access token from paypal', async () => {
    const tokenResponse = await generateAccessToken();
    expect(typeof tokenResponse).toBe('string');
    expect(tokenResponse.length).toBeGreaterThan(0);
    expect(tokenResponse.access_token).not.toBe('');
    expect(tokenResponse.access_token).not.toBeNull();
});

//Test to create order from paypal
test('creates order from paypal', async () => {
    const price = 10.0;
    const orderResponse = await paypal.createOrder(price);
    expect(orderResponse).toHaveProperty('id');
    expect(orderResponse).toHaveProperty('status');
    expect(orderResponse.status).toBe('CREATED');
});

//Test to capture payment with mock order
test('simulate capturing a payment from an order', async () => {
    const orderId = '1234567890';
    const mockOrderResponse = jest.spyOn(paypal, 'capturePayment').mockResolvedValue({
        status: 'COMPLETED',
    });
    const captureResponse = await paypal.capturePayment(orderId);
    expect(captureResponse).toHaveProperty('status', 'COMPLETED');
    mockOrderResponse.mockRestore();
});