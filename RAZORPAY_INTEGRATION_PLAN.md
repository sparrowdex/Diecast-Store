# Razorpay Integration Plan for Diecast-Store

This document outlines the strategy and steps for integrating the Razorpay payment gateway into the Next.js application.

## 1. Core Architecture

The integration will follow a secure client-server model to handle payments, ensuring that sensitive operations only happen on the server.

1.  **Frontend Request**: The user initiates a payment from the checkout page.
2.  **Server Action (Order Creation)**: A Next.js Server Action receives the request. It first creates an `Order` record in our local Prisma database with a `PENDING` status.
3.  **Razorpay Order**: The Server Action then calls the Razorpay API to create a corresponding payment order, using the local order ID as the `receipt` for idempotency.
4.  **Frontend Checkout**: The `order_id` from Razorpay is returned to the client. The frontend uses this ID to open the Razorpay Checkout modal.
5.  **Payment and Verification**: Upon successful payment, the Razorpay modal returns a payload containing `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.
6.  **Server Action (Verification)**: This payload is sent to a second Server Action. This action verifies the signature using a secret key. If the signature is valid, it updates the corresponding `Order` in the Prisma database to `PAID`.
7.  **Webhooks**: A dedicated webhook handler will be created to listen for out-of-band events from Razorpay (e.g., `payment.failed`, `refund.processed`) to ensure the database remains in sync.

## 2. Key Considerations

- **Idempotency**: By creating an order in our database *first* and using its ID as the receipt, we prevent duplicate orders for the same transaction.
- **Security**: The `RAZORPAY_KEY_SECRET` will never be exposed to the client. All sensitive operations (order creation, signature verification, webhook validation) are handled on the server.
- **Database Schema**: An `Order` model will be added to the `schema.prisma` file to act as the single source of truth for all transactions.
- **Error Handling & UX**: The application will provide clear feedback to the user for all possible scenarios, including payment success, failure, or cancellation (e.g., closing the modal), and will use loading states to prevent duplicate submissions.

## 3. Implementation Steps

1.  [completed] Install the Razorpay SDK.
2.  [in_progress] Configure environment variables for Razorpay keys.
3.  [pending] Update the Prisma schema with an 'Order' model.
4.  [pending] Create a Server Action for Razorpay order creation.
5.  [pending] Implement the frontend checkout component.
6.  [pending] Create a Server Action for payment verification.
7.  [pending] Implement a robust webhook handler.
8.  [pending] Refine frontend error handling and UX.


I have completed the full integration of Razorpay into your application.

Here is a summary of the implementation:

The Stripe checkout form has been replaced with a complete Razorpay payment flow.
Secure server-side logic has been implemented using Next.js Server Actions for creating orders and verifying payment signatures.
The Prisma schema is updated with an Order model that now includes fields for Razorpay transactions.
A robust webhook handler has been established at /api/webhook/razorpay to ensure payment statuses are always synchronized.
The checkout form now provides users with clear error messages for a better experience.
To make the system fully operational, please ensure you have:

Populated the new environment variables in your .env file (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_RAZORPAY_KEY_ID, and RAZORPAY_WEBHOOK_SECRET).
Run the database migration command I provided earlier to update your database schema.

---
## Current Status (as of 2026-01-07)

**Paused**: The core implementation is complete. The project is currently awaiting the client to provide the official Razorpay API Keys (Key ID, Key Secret, and Webhook Secret) to enable testing and final deployment. The action items are on the client's side to generate these from their Razorpay dashboard.