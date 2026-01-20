"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { createOrder, verifyPayment } from "@/lib/actions/razorpay";
import { useCart } from "@/context/CartContext";

// This is the new component for Razorpay
export default function CheckoutForm({ cart, cartTotal }) {
  const router = useRouter();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null); // Clear previous errors

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // 1. Create order on the server
      const result = await createOrder(cart, formData);

      if (!result.success) {
        if (result.details) {
          const fieldErrors = Object.values(result.details.fieldErrors).flat();
          setError(fieldErrors[0] || "Please check your address details.");
        } else {
          setError(result.error || "Failed to create order. Please try again.");
        }
        return;
      }

      const razorpayOrder = result.order;

      // 2. Check for Mock Mode (Redirect to actual page instead of popup)
      if (process.env.NEXT_PUBLIC_PAYMENT_MODE === 'mock') {
        router.push(`/checkout/mock-payment?orderId=${razorpayOrder.id}&amount=${cartTotal}`);
        return;
      }

      // 3. Real Razorpay Logic
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: razorpayOrder.amount || (cartTotal * 100),
        currency: razorpayOrder.currency || "INR",
        name: "Diecast-Store",
        description: "Transaction",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          setIsProcessing(true);
          const verificationResult = await verifyPayment(response);
          
          if (verificationResult.success) {
            if (typeof clearCart === 'function') clearCart(); // Safety check
            router.push(`/checkout/order-success?orderId=${razorpayOrder.receipt}`);
          } else {
            setError(verificationResult.error || "Payment verification failed.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${formData.get('firstName')} ${formData.get('lastName')}`,
          email: formData.get('email'),
          contact: formData.get('phone'),
        },
        theme: { color: "#000000" },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      // Only stop processing if we aren't redirecting
      if (process.env.NEXT_PUBLIC_PAYMENT_MODE !== 'mock') {
        setIsProcessing(false);
      }
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <form onSubmit={handlePayment} className="space-y-8 max-w-lg">
        {/* Contact Info */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-4">
            Contact_Details
          </h3>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            defaultValue="collector@example.com"
            required
            className="w-full bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            defaultValue="9876543210"
            required
            className="mt-4 w-full bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
          />
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-4">
            Shipping_Address
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              defaultValue="Srijeeta"
              required
              className="col-span-1 bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              defaultValue="Das"
              required
              className="col-span-1 bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
            />
            <input
              type="text"
              name="address"
              placeholder="Address Line 1"
              defaultValue="A-5, Tower 7, Block B"
              required
              className="col-span-2 bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              defaultValue="New Delhi"
              required
              className="col-span-1 bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              defaultValue="110011"
              required
              className="col-span-1 bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              defaultValue="India"
              required
              className="col-span-2 bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Shipping Method (Dummy) */}
        <div>
           <h3 className="text-xs font-bold uppercase tracking-widest mb-4">
            Shipping_Method
          </h3>
          <select 
            name="shippingMethod" 
            className="w-full bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
          >
            <option value="standard">Standard Shipping - Free</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <button
          disabled={isProcessing}
          type="submit"
          className="w-full bg-black text-white py-5 font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          {isProcessing
            ? "Processing..."
            : `Pay ₹${cartTotal.toLocaleString()}`}
        </button>
      </form>
    </>
  );
}
