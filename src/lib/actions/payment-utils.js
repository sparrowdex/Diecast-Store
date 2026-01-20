export const processPayment = async (orderData) => {
  const mode = process.env.NEXT_PUBLIC_PAYMENT_MODE || 'mock';

  if (mode === 'mock') {
    console.log("🛠️ Payment Mode: MOCK. Simulating transaction...");
    
    // 1. Simulate Network Latency
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 2. Simulate User Interaction (Bank Page)
    const confirmed = window.confirm(
      `[MOCK BANK PAGE]\n\nOrder ID: ${orderData.orderId}\nAmount: ₹${orderData.amount}\n\nClick OK to authorize payment.`
    );

    if (confirmed) {
      return {
        success: true,
        razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(7)}`,
        razorpay_order_id: orderData.orderId,
      };
    } else {
      return { success: false, error: "User cancelled the mock transaction." };
    }
  }

  // Razorpay Implementation
  if (mode === 'razorpay') {
    return new Promise((resolve) => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount * 100,
        currency: "INR",
        name: "Diecast Store",
        description: `Order #${orderData.orderId}`,
        handler: function (response) {
          resolve({
            success: true,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: orderData.customer.name,
          email: orderData.customer.email,
          contact: orderData.customer.phone,
        },
        theme: { color: "#000000" },
      };

      if (!window.Razorpay) {
        resolve({ success: false, error: "Razorpay SDK not loaded." });
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  }

  return { success: false, error: "Invalid Payment Mode" };
};