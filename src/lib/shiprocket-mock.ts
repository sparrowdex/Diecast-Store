/**
 * Mock Shiprocket Service
 * This simulates the Shiprocket API workflow. 
 * Switch to the actual Shiprocket SDK/API by replacing these methods.
 */

export const shiprocketMock = {
  // 1. Create a shipment in Shiprocket
  createShipment: async (orderData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      order_id: orderData.id,
      shipment_id: Math.floor(Math.random() * 10000000),
      status: "NEW",
      on_mock: true
    };
  },

  // 2. Generate AWB (Tracking Number)
  generateAWB: async (shipmentId: number) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      awb_code: `SR${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      courier_name: "BlueDart",
      courier_id: 24
    };
  },

  // 3. Generate Label URL
  generateLabel: async (shipmentId: number) => {
    return {
      success: true,
      label_url: "https://shiprocket.co/mock-label.pdf"
    };
  },

  // 4. Mock Tracking Status
  getTrackingStatus: (status: string) => {
    // Maps Shiprocket numeric/string codes to our UI phases
    const mapping: Record<string, string> = {
      "NEW": "PENDING",
      "AWB ASSIGNED": "SHIPPED",
      "IN TRANSIT": "IN_TRANSIT",
      "DELIVERED": "DELIVERED"
    };
    return mapping[status] || "PENDING";
  }
};