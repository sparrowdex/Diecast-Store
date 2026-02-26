# Pending Migration Guide: Price Refactor & Drift Resolution

This document outlines the steps required to sync the local schema with the remote Neon database and apply the `price` type change.

## Prerequisites
1. **Merge Branches**: Ensure all active feature branches (especially those involving Logistics or Inventory) are merged into your main branch.
2. **Environment Check**: Ensure `.env.local` contains valid `DATABASE_URL` and `DATABASE_URL_UNPOOLED` credentials.

## Step 1: Update Local Schema
Ensure `prisma/schema.prisma` includes the `sku` and `shipmentId` fields to match the remote database state. (Not Applied in the current update for main).

### Future Refactor: Price Type Change
When ready to convert `price` from `String` to `Float`:
1. Update `Product` and `OrderItem` models in `schema.prisma` to use `price Float`.
2. Update `src/app/api/products/route.js` to use `parseFloat(data.price)`.
3. Update `src/app/admin/inventory/new/page.js` to use `parseFloat(formData.price) || 0`.

## Step 2: Execute Migration
Run the following command in your terminal:
```bash
npx prisma migrate dev --name change_price_to_float
```

## Step 3: Handle the Reset
Prisma will detect "Drift" because the local migration history is missing entries found in the database. 
- When prompted: `We need to reset the "public" schema... All data will be lost. Do you want to continue?`
- Type: **`y`**

## Step 4: Verify
After the reset, Prisma will recreate the tables and apply the new `Float` type for prices.
1. Run `npx prisma generate` to update the client.
2. Restart your dev server.