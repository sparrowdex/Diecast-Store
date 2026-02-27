import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received Shiprocket Webhook:', JSON.stringify(body, null, 2));

    // TODO: Add signature verification here for security

    const { shipment_id, current_status } = body;

    if (!shipment_id) {
      return NextResponse.json({ success: false, message: 'Missing shipment_id' }, { status: 400 });
    }
    
    // Map Shiprocket status to our internal status
    // This is a placeholder - adjust based on actual webhook payloads
    let ourStatus = 'SHIPPED'; 
    if (current_status === 'OUT FOR DELIVERY') {
      ourStatus = 'IN_TRANSIT';
    } else if (current_status === 'DELIVERED') {
      ourStatus = 'DELIVERED';
    }

    await prisma.order.updateMany({
      where: { shipmentId: shipment_id.toString() },
      data: { status: ourStatus },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing Shiprocket webhook:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
