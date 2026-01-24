# Changelog - Diecast Store Refactor

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