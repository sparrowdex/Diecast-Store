"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import CheckoutForm from "@/components/CheckoutForm";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-black italic uppercase">Vault is Empty</h1>
        <Link href="/" className="mt-4 text-xs font-mono underline">
          Return to Gallery
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-black font-sans flex flex-col md:flex-row">
      {/* LEFT COLUMN: SHIPPING FORM */}
      <section className="w-full md:w-[60%] p-8 md:p-20 border-r border-black/5">
        <div className="mb-12">
          <Link
            href="/"
            className="text-[10px] font-mono text-gray-400 hover:text-black"
          >
            ← BACK_TO_GALLERY
          </Link>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mt-4">
            Secure Checkout
          </h1>
        </div>

        <CheckoutForm
          cart={cart}
          cartTotal={cartTotal}
          clearCart={clearCart}
        />
      </section>

      {/* RIGHT COLUMN: ORDER SUMMARY */}
      <section className="w-full md:w-[40%] bg-white p-8 md:p-20 h-auto md:min-h-screen sticky top-0">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-8">
          Order_Summary
        </h3>

        <div className="space-y-6 mb-8">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-gray-50 border border-black/5 p-2 flex items-center justify-center">
                <img
                  src={item.image}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase italic">{item.name}</p>
                <p className="text-[10px] text-gray-400 font-mono">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="text-xs font-mono font-bold">{item.price}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-black/10 pt-6 space-y-2">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500">
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500">
            <span>Shipping</span>
            <span>Calculated at next step</span>
          </div>
          <div className="flex justify-between text-xl font-black italic mt-4 pt-4 border-t border-black/10">
            <span>Total</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
        </div>
      </section>
    </main>
  );
}