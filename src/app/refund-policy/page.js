import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg">
        <h1 className="text-3xl font-bold mb-4">Refund Policy</h1>

        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Disclaimer</p>
          <p>This is a placeholder for your Refund Policy. You should replace this text with a policy that accurately reflects your business practices and complies with consumer protection laws.</p>
        </div>

        <p>Last updated: January 07, 2026</p>

        <p>
            Thank you for shopping at Diecast-Store. If you are not entirely satisfied with your purchase, we're here to help.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Returns</h2>
        <p>
            You have [Number] calendar days to return an item from the date you received it.
        </p>
        <p>
            To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.
        </p>
        <p>
            Your item needs to have the receipt or proof of purchase.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Refunds</h2>
        <p>
            Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
        </p>
        <p>
            If your return is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain amount of days, depending on your card issuer's policies.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Shipping</h2>
        <p>
            You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.
        </p>
        <p>
            If you receive a refund, the cost of return shipping will be deducted from your refund.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
        <p>
          If you have any questions on how to return your item to us, contact us at:<br/>
          Diecast-Store<br/>
          [Your Contact Information Here]<br/>
          [Your Email Address Here]
        </p>
      </div>
    </div>
  );
}
