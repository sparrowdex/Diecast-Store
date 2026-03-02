import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers.get('x-razorpay-signature');
  const isMockRequest = req.headers.get('x-mock-request') === 'true';

  if (!isMockRequest) {
    if (!signature) {
      return NextResponse.json({ error: 'No signature found' }, { status: 400 });
    }

    const bodyText = await req.clone().text();
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(bodyText)
      .digest('hex');

    if (generated_signature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  // Signature is valid or it's a mock request, now process the webhook event
  const event = await req.json();
  const { event: eventType, payload } = event;

  try {
    switch (eventType) {
      case 'payment.captured':
        const paymentCaptured = payload.payment.entity;

        // 1. Find the order and its items
        const order = await prisma.order.findUnique({
          where: { razorpayOrderId: paymentCaptured.order_id },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        if (!order) {
          throw new Error('Order not found');
        }

        // 2. Prepare stock updates for each product in the order
        const stockUpdates = order.items.map(item => {
          return prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        });

        // 3. Prepare the order status update
        const orderUpdate = prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'PAID',
            razorpayPaymentId: paymentCaptured.id,
          },
        });

        // 4. Execute all updates in a single transaction
        await prisma.$transaction([...stockUpdates, orderUpdate]);

        break;

      case 'payment.failed':
        const paymentFailed = payload.payment.entity;
        await prisma.order.update({
          where: { razorpayOrderId: paymentFailed.order_id },
          data: {
            paymentStatus: 'FAILED',
            razorpayPaymentId: paymentFailed.id,
          },
        });
        break;

      // You can add more cases here for other events like refunds
      // case 'refund.processed':
      //   // ... handle refund logic
      //   break;

      default:
        // Unsupported event type
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
