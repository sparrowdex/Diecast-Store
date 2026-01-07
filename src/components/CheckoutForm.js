"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { createOrder, verifyPayment } from "@/lib/actions/razorpay.ts";

// This is the new component for Razorpay
export default function CheckoutForm({ cart, cartTotal, clearCart }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null); // Clear previous errors

    const form = e.currentTarget;
    const formData = new FormData(form);

    // 1. Create order on the server
    const result = await createOrder(cart, formData);

    if (!result.success) {
      setError(result.error || "Failed to create order. Please try again.");
      setIsProcessing(false);
      return;
    }

    const razorpayOrder = result.order;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Diecast-Store",
      description: "Transaction",
      order_id: razorpayOrder.id,
      handler: async function (response) {
        setIsProcessing(true);
        setError(null);
        // 2. This runs on success - Verify payment on server
        const verificationResult = await verifyPayment(response);
        
        if (verificationResult.success) {
          clearCart();
          router.push(`/thank-you?orderId=${razorpayOrder.receipt}`);
        } else {
          setError(verificationResult.error || "Payment verification failed. Please contact support.");
          setIsProcessing(false);
        }
      },
      prefill: {
        name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email'),
        contact: formData.get('phone'),
      },
      theme: {
        color: "#000000",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
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
            required
            className="w-full bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
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
              required
              className="col-span-1 bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              required
              className="col-span-1 bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
            />
            <input
              type="text"
              name="address"
              placeholder="Address Line 1"
              required
              className="col-span-2 bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              required
              className="col-span-1 bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              required
              className="col-span-1 bg-white border border-black/10 p-4 text-xs font-mono focus:outline-none focus:border-black"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
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
