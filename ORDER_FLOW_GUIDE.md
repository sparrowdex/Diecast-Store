# Order Lifecycle & Fulfillment Guide

This document explains how the ordering, payment, and shipping systems work within the Diecast Store application.

---

## 1. The Checkout Process
When a customer is ready to acquire an exhibit, the following sequence occurs:

1.  **Order Initiation**: When the user clicks "Pay Now" in the `CheckoutSummary`, the app immediately calls a Server Action (`createOrderAction`).
2.  **Database Entry**: An entry is created in the `Order` table with a status of `PENDING` and a payment status of `UNPAID`. This ensures that even if the user closes their tab during payment, the intent is captured.
3.  **Razorpay Handshake**: The server requests a unique `order_id` from Razorpay. This ID is sent back to the frontend to open the secure Razorpay Payment Modal.

---

## 2. Payment Verification
Security is handled through a multi-step verification process:

1.  **Customer Payment**: The user enters their details in the Razorpay modal.
2.  **Signature Generation**: Razorpay generates a unique encrypted signature upon successful payment.
3.  **Server-Side Validation**: The app sends this signature to our server. We verify it using the `RAZORPAY_KEY_SECRET`. 
4.  **Status Update**: Only after the signature is verified does the database update the order to `PAID`.

---

## 3. Fulfillment & Shipping (Admin Role)
Since physical diecast cars require manual packing and dispatch, the fulfillment flow is as follows:

1.  **Processing**: Once an order is `PAID`, the Admin sees the order in the dashboard. The status is moved to `PROCESSING` while the item is being packed.
2.  **Courier Dispatch**: The Admin takes the package to a courier (e.g., BlueDart, Delhivery). The courier provides a physical tracking number.
3.  **Updating the Order**: The Admin enters the **Tracking Number** into the Order Management section of the Admin Panel and changes the status to `SHIPPED`.
4.  **Completion**: Once the courier confirms delivery, the Admin marks the order as `DELIVERED`.

---

## 4. Customer Experience (Tracking)
Customers have a dedicated, transparent view of their purchase:

*   **Order Status Page**: Located at `/orders/[id]`, this page features a visual progress tracker (Placed → Processing → Shipped → Delivered).
*   **Real-time Updates**: As soon as the Admin adds a tracking number or changes the status, the customer's page updates automatically.
*   **Tracking Link**: If a tracking number is present, a "Track Package" button appears, allowing the user to see exactly where their exhibit is.

---

## 5. Technical Data Structure
For transparency with the client, here is what we track for every order:

| Field | Description |
| :--- | :--- |
| `total` | The final amount paid (Products + Shipping). |
| `shippingCost` | The specific portion of the total allocated to delivery. |
| `status` | The physical stage of the order (Pending, Processing, Shipped, Delivered). |
| `paymentStatus` | The financial stage (Unpaid, Paid, Failed). |
| `trackingNumber` | The carrier-provided ID for the shipment. |
| `razorpayId` | The official transaction reference for accounting. |

---

## 6. Future Enhancements
As the store scales, we have planned for the following automations:
*   **Automated Labels**: Integrating with APIs like Shiprocket or Shippo to generate tracking numbers and shipping labels automatically upon payment.
*   **Email Notifications**: Automated triggers to email the customer the moment their tracking number is added.

---

## 7. Mock vs. Production Payments
To facilitate development and testing without real financial transactions, the app currently uses a **Mock Payment System**.

### Current Mock Implementation
*   **Simulation**: The `processPayment` utility (called in `CheckoutSummary.jsx`) bypasses the Razorpay servers and simulates a successful response after a brief delay.
*   **Test Data**: Mock payments generate IDs prefixed with `pay_mock_` to ensure they are easily identifiable in the database and accounting logs.
*   **Logic Flow**: The mock system follows the exact same state transitions (Pending -> Paid) as the real system. This ensures that the Order Tracking UI and database triggers are fully validated before any real money is handled.

### Switching to Actual Razorpay
Transitioning to live payments is a "flip-the-switch" process:
1.  **Environment Variables**: Populate `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in the production `.env` file.
2.  **Mode Toggle**: In the `payment-utils.js` library, the `isMock` flag (or an environment variable like `NEXT_PUBLIC_PAYMENT_MODE`) is switched to `production`. This enables the real Razorpay Checkout script.
3.  **Webhook Activation**: The live Webhook URL must be configured in the Razorpay Dashboard to point to the store's `/api/webhook/razorpay` endpoint. This ensures the database is updated even if a user closes their browser before the redirect completes.

---
*Document Version: 1.0 (2026-01-24)*