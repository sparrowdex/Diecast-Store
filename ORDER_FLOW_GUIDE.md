# Order Lifecycle & Fulfillment Guide

This document explains how the ordering, payment, and shipping systems work within the Diecast Store application.

---

## 0. ID Distinction (Crucial)
*   **Reference ID (Order ID)**: Generated immediately upon checkout (e.g., `ORD_123`). This is the "Digital Receipt" the customer sees on their success page and in their "Vault."
*   **Tracking ID (AWB)**: Generated only when the Admin fulfills the order via Shiprocket (e.g., `SR998877`). This is the "Physical Passport" for the package.
*   **The Bridge**: The Admin's primary job is to link these two IDs by processing the shipment in the Admin Dashboard.

## 1. The Checkout Process
To ensure **Robustness**, the checkout follows a "Lock-and-Verify" pattern:

1.  **Stock Validation**: Before calling Razorpay, the app checks if the item is still in the "Vault" (Database) to prevent overselling.
2.  **Step-by-Step Accordion**:
    - **Phase 1 (Logistics)**: Capture address and contact.
    - **Phase 2 (Telemetry)**: Display delivery estimates and shipping method selection (Standard vs Express).
    - **Phase 3 (Financial)**: Trigger Razorpay handshake only after logistics are confirmed.
3.  **Order Initiation**: A Server Action (`createOrderAction`) creates a `PENDING` order.
3.  **Idempotency**: We use the Order ID as a reference for Razorpay to prevent duplicate charges for the same transaction.
4.  **Database Entry**: An entry is created with `paymentStatus: UNPAID`.
3.  **Razorpay Handshake**: The server requests a unique `order_id` from Razorpay. This ID is sent back to the frontend to open the secure Razorpay Payment Modal.
5.  **Cart Clearing**: The cart is only cleared *after* the server confirms the payment signature, preventing lost items if a payment fails.

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

1.  **Shiprocket Sync**: Once an order is `PAID`, the Admin clicks **"Create Shiprocket Order"**. This sends the customer's address and weight to the Shiprocket Mock API.
2.  **AWB Generation**: The Admin clicks **"Generate AWB"**. This assigns a tracking number (e.g., `SR12345`) automatically.
3.  **Label Printing**: A **"Download Label"** button appears. The Admin prints this and attaches it to the diecast box.
4.  **Manifest & Pickup**: The Admin clicks **"Schedule Pickup"**. The status automatically moves to `SHIPPED` in the database.
5.  **Auto-Tracking**: The system polls Shiprocket (or receives a Webhook) to move the status to `IN_TRANSIT` and finally `DELIVERED` without manual Admin intervention.

### Admin UI Components (New)
*   **Shipment Status Badge**: Shows real-time Shiprocket status (e.g., "Pickup Scheduled").
*   **Action Buttons**: `Create Shipment`, `Generate AWB`, `Print Label`.
*   **Dimensions Input**: Fields for Length, Width, Height, and Weight (required for Shiprocket).

---

## 4. Customer Experience (Tracking)
Customers have a dedicated, transparent view of their purchase:

*   **Order Status Page**: Located at `/orders/[id]`, this page features a visual progress tracker (Placed → Processing → Shipped → Delivered).
*   **Real-time Updates**: As soon as the Admin adds a tracking number or changes the status, the customer's page updates automatically.
*   **Tracking Link**: If a tracking number is present, a "Track Package" button appears, allowing the user to see exactly where their exhibit is.

---

## 4. Testing the Workflow
To verify the mock logistics system:
0. **Database Sync**: Run `npx prisma migrate dev --name add_shipment_id` to apply the new schema changes.
1. **Admin Simulation**: Use the `FulfillmentCard` in the Admin Dashboard to process a `PAID` order.
2. **State Verification**: Ensure the `onUpdate` callback correctly persists the `awb_code` to your database.
3. **UI Sync**: Open the Customer's `/orders/[id]` page. The `DeliveryTracker` must dynamically update:
    - `trackingNumber` changes from `UNASSIGNED_ID` to the mock AWB.
    - The visual timeline advances to the **SHIPPED** node.

---

## 5. Technical Data Structure
For transparency with the client, here is what we track for every order:

| Field | Description |
| :--- | :--- |
| `total` | The final amount paid (Products + Shipping). |
| `shippingCost` | The specific portion of the total allocated to delivery. |
| `status` | The physical stage of the order (Pending, Processing, Shipped, Delivered). |
| `paymentStatus` | The financial stage (Unpaid, Paid, Failed). |
| `shipmentId` | The internal Shiprocket ID used for API actions (Labels, Pickups). |
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