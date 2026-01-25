# Changelog - Diecast Store Refactor

## [2026-01-25] - UI/UX, Persistence & Telemetry Fixes

### Added
- **Dedicated Tracking Page**: Implemented a standalone tracking route (`/access/orders/[id]/track`) to provide a focused "Shipment Telemetry" view for customers.
- **Manifesto Retrieval**: Added a "Download Technical Manifesto" button to each order card in the Order History section, allowing users to retrieve their acquisition documents at any time.
- **Delivery Telemetry**: Created a reusable `DeliveryTracker` component with a "Race Track" visual progress bar (GRID_POSITION → PIT_LANE → ON_TRACK → CHECKERED_FLAG) for the Order History section.
- **Pit Wall Telemetry**: Transformed the Admin Dashboard into an F1-inspired telemetry center (`Pit_Wall_Telemetry`) featuring real-time KPIs like Circuit Value, Active Fleet, and Pit Lane Queue.
- **Out of Stock Stamp**: Implemented a "Decommissioned Exhibit" industrial stamp effect for products with zero stock, using `framer-motion` for a high-impact "slam" animation.
- **Sector Analytics**: Added visual genre distribution telemetry and a "High Value Podium" to the admin dashboard for better fleet management.
- **Critical Fuel Alerts**: Integrated a real-time stock monitoring system in the dashboard to highlight items requiring immediate "Pit Stop" (restock).
- **Vault Persistence**: Integrated `localStorage` syncing in `CartContext.js` to ensure items in the Vault persist across page refreshes.
- **Quantity Selection**: Implemented a technical quantity selector in `ProductDetails.js` allowing users to acquire multiple units of the same exhibit (capped by available stock).
- **Stock Awareness**: Added "Sold Out" logic to the acquisition flow to prevent over-ordering.
- **F1 Aesthetic**: Added a checkered racing line pattern to the `BentoCard` hover sidebar for a high-performance automotive feel.
- **SpeedLink Animation**: Refactored the "Acquire" button with a professional "overtake" animation using a dual-text slider, `overflow: hidden`, and skew effects to prevent layout flickering.
- **NA Featured Status**: Implemented a specific "NA Featured" status badge in the Admin Inventory table for items that are both New Arrivals and Featured, maintaining a consistent low-opacity UI style.

### Changed
- **Real Data Integration**: Updated the Admin Dashboard to fetch live pending orders from the database, replacing hardcoded placeholders.
- **Smart Tag Hierarchy**: Refactored `StandardCard` layout to separate technical specs (top) from identity tags (bottom), including auto-hiding Genre tags on hover to prevent UI clutter.
- **Cart Logic**: Updated `addToCart` to support variable quantities and added `updateQuantity` and `clearCart` helpers.
- **Scale Standardization**: Updated available scales to `1:64`, `1:32`, `1:24`, and `1:18` per client requirements; removed `1:12` and `1:43` from all forms and filters.
- **Mobile Responsiveness**:
    - Refactored `Gallery` and `Catalog` headers to be fully responsive across all device widths.
    - Optimized the Navbar to span the full width of mobile devices using `justify-between`, ensuring the "Vault" button stays aligned with navigation links on small screens (iPhones).
    - Implemented dynamic font scaling for the main logo and section titles to prevent horizontal overflow.
- **Theme Reversion**: Reverted the `BentoCard` hover sidebar to a white background to improve product visibility and maintain a clean gallery aesthetic.

### Fixed
- **Confetti Logic**: Resolved an infinite loop bug in the `OrderSuccessClient` confetti animation by fixing the timestamp calculation.
- **PDF Generation**: Optimized `html2canvas` settings to resolve issues preventing the "Technical Manifesto" from downloading. **(Note: The critical severity jspdf vulnerability still persists).**
- **Color Compatibility**: Fixed a "Technical Manifesto" download failure caused by `html2canvas` being unable to parse Tailwind CSS v4 `oklab` and `lab` color functions; implemented explicit RGB/Hex fallbacks for the capture area.
- **Security Patching**: Forced `jspdf` to `v2.5.2` via global `overrides` to mitigate ReDoS and Path Traversal vulnerabilities. Synchronized Prisma ecosystem to `v7.3.0`. **(Note: The critical severity vulnerability still persists).**
- **Dependency Cleanup**: Removed redundant `prisma` entry from production dependencies in `package.json`.
- **Database Resilience**: Resolved critical "connection closed by server" errors in development by optimizing `prisma.ts` to prioritize Neon's pooled connection and enabling query pipelining.
- **Telemetry Accuracy**: Fixed a synchronization issue where the Admin Dashboard incorrectly reported zero orders due to database timeouts; implemented selective fetching to reduce WebSocket payload size.
- **Build Process**: Resolved a critical build error caused by the missing `html-to-image` dependency in the production environment.

---

## [2026-01-24] - API & UI Refinements

### Changed
- **Featured Logic**: Updated `getFeaturedExhibits` in `page.js` to ensure manual layout configurations strictly respect the `FEATURED_EXHIBIT` status, preventing non-featured items from appearing in the Bento grid.
- **API Validation**: Updated `/api/products` (POST) and `/api/products/[id]` (PUT) to ensure `modelYear` is parsed as an Integer and implemented strict Enum validation for `genre` and `collectionStatus`.
- **Redundancy Fix**: Restricted `featured` boolean filtering to the `NEW_ARRIVAL` status only to prevent data conflicts with `FEATURED_EXHIBIT`.
- **UI Standardization**:
    - Standardized currency symbols (`₹`) across `StandardCard`, `BentoCard`, and `CatalogCard`.
    - Implemented robust image fallback logic in `StandardCard` and `BentoCard` to handle both the new `images` array and legacy `image` string.
    - Updated `BentoCard` to use dynamic `sidebarWidth` based on grid layout.
- **Checkout Refinement**: Fixed image display in `CheckoutSummary.jsx` to support the new `images` array structure.
- **Shipping Logic**: Added `shippingCost` to the `Order` model in `schema.prisma` for better transaction tracking.
- **Order Tracking**: Added `trackingNumber` to `Order` model and implemented the Order Status tracking UI.
- **Future Planning**: Identified the need for Shipping API integration to automate tracking number generation (currently manual).
- **Documentation**: Created `ORDER_FLOW_GUIDE.md` to explain the end-to-end purchase and fulfillment process.
- **Data Integrity**: Enforced `featured: false` in API routes for any product not marked as `NEW_ARRIVAL` to prevent data conflicts.
- **Journal Consistency**: Updated `JournalEntry` model in `schema.prisma` to use `images String[]` and `video String?` to match the `Product` model's media structure.
- **Documentation**: Updated `FEATURE_GUIDE.md` to reflect the transition from "Category" to "Collection Status".
- **Task Completion**: Marked all database resilience tasks in `TODO.md` as completed.

### Fixed
- Fixed price input placeholder in `ExhibitPreview` to prevent "double currency" display bugs.
- **Badge Logic**: Fixed `StandardCard` to use `collectionStatus` instead of the non-existent `isNew` property for displaying badges.

## [2026-01-21] - Categorization & Schema Overhaul

### Added
- **New Schema Fields**: Added `collectionStatus` (Enum), `genre` (Enum), and `modelYear` (Int) to the `Product` model in Prisma.
- **Genre Filtering**: Implemented a new "Car Identity" system with 7 specific genres (Classic & Vintage, Race Course, etc.) across the Home, Catalog, and Journal pages.
- **Scale Dropdowns**: Replaced free-text scale inputs with a standardized dropdown (`1:64`, `1:43`, etc.) to ensure filter consistency.
- **UI Badges**: Updated product cards and `ExhibitPreview` to display the new `modelYear` and `genre` data.
- **Search API**: Updated `/api/products` GET handler to support filtering by `genre`, `collectionStatus`, `modelYear`, and keyword search (`q`).

### Changed
- **Decoupled Logic**: Separated "App Location" (where a car appears) from "Car Identity" (what the car is).
    - `category` (String) -> `collectionStatus` (Enum: `ARCHIVE_CATALOG`, `NEW_ARRIVAL`, `FEATURED_EXHIBIT`).
- **Admin Refactor**: Updated `NewExhibit` and `EditExhibit` forms to support the split categorization.
- **Data Fetching**: Updated server-side queries in `page.js`, `catalog/page.js`, and `product/[id]/page.js` to use the new `collectionStatus` field and added try-catch blocks for database resilience.
- **Filter UI**: Converted Genre and Scale filters into dropdown menus to prevent UI clutter.

### Fixed
- Resolved `PrismaClientValidationError` caused by the removal of the legacy `category` field.

### Cleanup
- Removed `FeaturedExhibitPreviewStatic.js` as it is no longer used.

---

## Pending Tasks (To-Do)

### 1. Data Re-tagging
- [ ] **Manual Update**: Since the migration dropped the `category` column, existing products need to be manually assigned a `collectionStatus` and `genre` via the Admin Panel or Prisma Studio.

---
*End of Log*