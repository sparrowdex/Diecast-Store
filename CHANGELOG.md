# Changelog - Diecast Store Refactor

## [2026-02-15] - Public Access & UI Accessibility

### Changed
- **Middleware Whitelisting**: Updated `proxy.ts` to include legal and policy routes (`/terms-of-service`, `/privacy-policy`, `/refund-policy`) as public routes, ensuring they are accessible to guests without authentication.
- **Footer Accessibility**: Refactored the `Direct_Line` contact in `Footer.js` from a static `div` to a functional `tel:` anchor tag to enable click-to-call functionality on mobile devices.

### Fixed
- **Auth Gate Logic**: Resolved an issue where guest users were being redirected to the Clerk login page when attempting to access the Terms of Service or Privacy Policy from the footer.

### What We Learnt
- **Public Route Scope**: Whitelisting routes in middleware is essential for legal compliance pages to ensure they remain accessible even when the rest of the application is protected.

---

## [2026-02-13] - Inventory Integrity & Order Consolidation

### Added
- **Schema Evolution**: Integrated `sku` (Stock Keeping Unit) and `stock` fields into the `Product` and `OrderItem` models to support real-time inventory tracking.
- **Atomic Transactions**: Implemented `prisma.$transaction` in the checkout flow to ensure that order creation and stock decrement happen as a single, unbreakable operation.
- **Telemetry Fallbacks**: Added logic to generate `PART_REF` identifiers from `productId` slices in the UI when a manual SKU is not assigned.
- **Order History Telemetry**: Implemented offset pagination ("Sectors") and status filtering to manage large acquisition histories efficiently.
- **SSR Upload Handshake**: Integrated `NextSSRPlugin` in the root layout to enable seamless client-server communication for UploadThing.

### Changed
- **Order Consolidation**: Refactored the checkout logic from multiple individual orders to a single `Order` with nested `OrderItem` creates. This ensures all items purchased together appear in one "Order Manifest" box.
- **Mobile UI Hardening**:
    - Updated `OrderHistoryItem` to use `flex-col-reverse` on mobile, preventing metadata overflow.
    - Implemented `line-clamp-1` on product names to maintain card uniformity on small screens.
    - Switched to `toLocaleString` for more compact, mobile-friendly date rendering.
- **Prisma 6 Configuration**: Updated `prisma.config.ts` to manually load `.env.local` using `dotenv` to satisfy Prisma 6's new configuration requirements.
- **Middleware Security**: Updated `proxy.ts` to whitelist the UploadThing API route, allowing webhooks to bypass Clerk authentication for completion signals.
- **Media Payload Expansion**: Increased `maxFileSize` to `16MB` in the `mediaUploader` router to support high-fidelity PNG exhibits.

### Fixed
- **Merge Conflict Deadlock**: Resolved the `MERGE_HEAD` error by manually reconciling `README.md` conflicts and completing the merge commit.
- **Prisma 6 Environment Bug (P1012)**: Fixed the "Environment variable not found" error caused by Prisma 6 skipping `.env` files when a `prisma.config.ts` is present.
- **Client Generation Lock (EPERM)**: Resolved file permission errors during `prisma generate` by identifying and closing processes (Next.js dev server) holding the query engine binary.
- **Inventory Overselling**: Added a logic gate to throw an error and rollback transactions if a purchase would result in negative stock.
- **Upload Deadlock**: Resolved the issue where uploads would hang at 100% by ensuring the server-side webhook could reach the application.
- **FileSizeMismatch Error**: Fixed configuration errors when uploading large assets by aligning server-side limits with collector requirements.

### Challenges Faced
- **Windows File Locking**: Encountered `EPERM` errors where the OS prevented Prisma from updating its client while the Next.js runtime was active.
- **Prisma 6 Config Strictness**: Navigating the shift in how Prisma 6 handles environment variables compared to previous versions.
- **UI Grouping Logic**: Solving the "separate boxes" issue required a fundamental shift in how data is written to the database during the checkout handshake.
- **Webhook Tunneling**: Navigating the limitations of `localhost` when receiving external pings from file storage providers.

### What We Learnt
- **The "One-to-Many" Rule**: Learnt that UI grouping issues are almost always a reflection of database normalization; one checkout must equal one Order record.
- **Prisma 6 Manual Loading**: Discovered that using `defineConfig` in Prisma 6 requires manual `dotenv` integration for local development environments.
- **Atomic Operations**: Understood that `decrement` operations must be wrapped in transactions to prevent race conditions in high-traffic "Vault" acquisitions.
- **Middleware Whitelisting**: Realized that third-party webhooks require explicit public route definitions in Clerk middleware to function correctly.

---

## [2026-02-13] - Shiprocket Integration Refactor & Architectural Alignment

### Added
- **`src/lib/actions/shiprocket.ts`**: Created a new server action file to handle all Shiprocket-related logic, mirroring the structure of `razorpay.ts`. This includes creating shipments, generating labels, and manifesting pickups.
- **`src/app/api/webhook/shiprocket/route.ts`**: Implemented a new webhook endpoint to receive real-time shipment status updates from Shiprocket.
- **Standardized Response Objects**: The new Shiprocket actions now return a standardized response object (`{ success: boolean, data?: any, error?: string }`) for consistency with the Razorpay implementation.
- **`zod` for Validation**: Added `zod` to the project and used it to validate the dimensions and weight of the package before creating a shipment.

### Changed
- **`FulfillmentCard.js` Refactor**: The `FulfillmentCard` component has been completely refactored to use the new server actions in `shiprocket.ts`. The logic for creating shipments has been moved to the server, and the component now handles loading and error states based on the server's response.
- **Architectural Alignment**: The Shiprocket integration now follows the same "Server Action -> Verification -> Webhook" pattern as the Razorpay integration, making the codebase more consistent and maintainable.

### Fixed
- **Removed Direct API Calls from Component**: The `FulfillmentCard` component no longer makes direct calls to the Shiprocket mock API. All communication with the Shiprocket service is now handled through server actions.
- **Centralized Logic**: The Shiprocket logic is now centralized in `src/lib/actions/shiprocket.ts`, making it easier to manage and switch to the real Shiprocket API in the future.

### Removed
- **`src/lib/shiprocket-mock.ts`**: The old mock file has been deleted as its logic has been moved to the new `shiprocket.ts` file.

### Challenges Faced
- **Refactoring UI Logic to Server Actions**: The main challenge was to carefully extract the shipment creation logic from the `FulfillmentCard` component and move it to a server action, ensuring that the UI remains responsive and provides clear feedback to the user.
- **Ensuring Consistency**: A key focus was to ensure that the new Shiprocket integration is architecturally consistent with the existing Razorpay integration. This required careful planning and a deep understanding of the existing codebase.

### What We Learnt
- **The Power of Parallel Architectures**: By mirroring the Razorpay implementation, we were able to refactor the Shiprocket integration quickly and efficiently. This approach also makes the codebase easier to understand and maintain.
- **Server Actions for Cleaner Components**: Moving complex logic from components to server actions makes the components cleaner, more focused on the UI, and easier to test.
- **The Importance of a "Consistency Checklist"**: The checklist we created for the Shiprocket integration was instrumental in ensuring that the new implementation is consistent with the rest of the codebase.

---

## [2026-02-08] - Logistics Intelligence & Next.js 16 Hardening

### Added
- **Shiprocket Mock Service**: Created a dedicated service layer in `src/lib/shiprocket-mock.ts` to simulate AWB generation and shipment tracking.
- **SLA Priority System**: Implemented logic to flag orders as `NEW`, `URGENT`, or `CRITICAL` based on fulfillment duration (24/48h thresholds).
- **Telemetry HUD**: Added a real-time KPI dashboard to the Admin Order Log showing fleet size, critical alerts, and circuit valuation.
- **Git Command Manual**: Created `study-notes/git-commands.md` to document modern branch management and stashing workflows.
- **Shipment ID Persistence**: Updated `schema.prisma` to store internal logistics IDs, ensuring the database is ready for production API keys.

### Changed
- **Admin Order Log Redesign**: Overhauled the list view with a "Pit Wall" aesthetic, including faded grid lines, SLA pings, and action-oriented navigation.
- **Delivery Tracker Evolution**: Updated the UI to map technical Shiprocket statuses (e.g., `READY_TO_SHIP`) to the F1-themed timeline and added "Copy Node ID" functionality.
- **Fulfillment Workflow**: Transformed the Admin fulfillment UI into a multi-step "Action Center" (Metrics -> Label Generation -> Manifest).
- **README Overhaul**: Rebranded the project documentation to focus on "Pit Wall Telemetry" and technical precision.
- **Checkout Robustness**: Documented the "Lock-and-Verify" pattern to prevent overselling and ensure payment idempotency.

### Fixed
- **Next.js 16 Params Promise**: Resolved `P1012` and `sync-dynamic-apis` errors by unwrapping `params` as a Promise in both Client Components (`use()`) and API routes (`await`).
- **Prisma 6 Config Conflict**: Fixed environment variable loading issues caused by `prisma.config.ts` by utilizing `dotenv-cli` to bridge `.env.local` with the Prisma CLI.
- **Server Action Validation**: Corrected non-async exported functions in `'use server'` files to satisfy the Next.js compiler.
- **Prisma Import Syntax**: Resolved named export errors by switching to default imports for the Prisma client utility.
- **Database Sync**: Successfully migrated the schema to include `shipmentId` using a professional migration history approach.

### Challenges Faced
- **Next.js 15/16 Transition**: Adapting to the new asynchronous nature of `params` and `searchParams` required a systematic refactor of dynamic routes.
- **Prisma 6 Strictness**: Prisma 6's new validation for `directUrl` and its behavior of skipping `.env` files when a config file is present created initial migration friction.
- **Logistics Mapping**: Translating technical courier statuses into a simplified, high-impact visual timeline for collectors.

### What We Learnt
- **ID Distinction is Key**: Separating the "Digital Receipt" (Order ID) from the "Physical Passport" (AWB) is crucial for professional e-commerce operations.
- **Async Everything**: In Next.js 15+, even simple helper functions in Server Action files must be `async` to avoid compilation errors.
- **Telemetry as UX**: Providing the Admin with "Urgency" indicators (SLA Status) transforms a static table into a functional logistics tool.

---

## [2026-02-06] - Production Hardening & Configuration Standards

### Added
- **Prisma Configuration File**: Migrated Prisma settings from `package.json` to a dedicated `prisma.config.ts` to align with Prisma 6/7 standards.
- **API Role Verification**: Implemented internal admin checks in `POST /api/journal` using Clerk `sessionClaims` to prevent unauthorized entries.
- **Dashboard Data API**: Created `GET /api/user/dashboard-data` to provide real-time collection stats and genre-based completion progress.
- **Products API**: Implemented `GET` (with filtering) and `POST` (with admin protection) for the master catalog.
- **Collector Activity Tracking**: Added `lastActivity` telemetry to the dashboard data for real-time engagement monitoring.

### Changed
- **Middleware Expansion**: Updated `middleware.js` to include `/api/journal(.*)` as a public route, enabling guest access to the journal feed.
- **Journal API Refactor**: Cleaned up `route.js` syntax, removing unreachable code and nested function declarations.
- **Genre Metadata Centralization**: Moved genre labels and icons to `GENRE_METADATA` in `badgeLogic.js` for a single source of truth.
- **Schema Cleanup**: Removed the legacy `category` field from the `Product` model in `schema.prisma` to enforce `Genre` enum usage.

### Fixed
- **Middleware Syntax Error**: Resolved `Identifier 'isPublicRoute' has already been declared` by consolidating route matchers.
- **API 404 Errors**: Fixed "Failed to fetch stories" by ensuring the API endpoint was not being intercepted/blocked by Clerk.
- **Prisma Deprecation Warnings**: Silenced warnings regarding `package.json#prisma` by adopting the new configuration pattern.
- **Gamification Sync**: Resolved mismatch between profile badges and dashboard progress by aligning both with the `Genre` enum.
- **Collector ID Date Logic**: Fixed chronological inconsistencies where "Member Since" appeared after "Last Activity" by calculating dates based on the earliest and latest known interactions (orders vs. profile creation).

### Challenges Faced
- **Middleware vs. API Logic**: Balancing the need for a public `GET` request with a protected `POST` request on the same endpoint. Solved by making the route public in middleware and adding manual role checks in the API handler.
- **Prototype to Production Transition**: Encountered "Additive Complexity" where security and standardization requirements began to outpace simple feature development.

### What We Learnt
- **Security is Layered**: Middleware is the first line of defense, but internal API checks (RBAC) are the "armor" that protects the database.
- **Standardization Matters**: Moving configuration to dedicated files (`prisma.config.ts`) improves maintainability and IDE support.
- **Production Resilience**: Transitioning to production requires moving beyond the "Happy Path" to handle edge cases, error logging, and strict data validation.

---

## [2026-02-03] - Master Catalog Dictionary & Collector Achievements

### Added
- **Master Catalog Dictionary**: Transformed the `/catalog` route into a comprehensive "Dictionary" of all collections, including Featured Exhibits and New Arrivals.
- **Status-Aware Catalog Cards**: Updated `CatalogCard` to dynamically render `NEW ARRIVAL` and `FEATURED EXHIBIT` badges within the general grid.
- **Genre Verification System**: Implemented a logic gate in `badgeLogic.js` that unlocks visual "Verification Stamps" for Collector IDs upon 100% completion of a specific series.
- **Series Completion UI**: Added `GenreBadgeGrid` to the profile configuration to track collection progress (e.g., 3/5) and display earned stamps.
- **Admin Catalog Preview**: Integrated a "Master Catalog Preview" into the Admin HUD to verify grid appearance for all exhibit types.
- **Vault Stock Awareness**: Added "Max Stock" indicators and disabled increment controls in the `CartDrawer` when available inventory is reached.

### Changed
- **Vault Logic Overhaul**: Refactored `CartContext.js` to use absolute quantity updates, fixing a critical bug where items would increment exponentially.
- **Featured Media Scaling**: Switched `BentoCard` media from `object-cover` to `object-contain` to ensure diecast models are never cropped regardless of screen size.
- **Journal Mobile Optimization**: Reduced image-to-text ratios on mobile and enhanced `prose` typography for better long-form readability.
- **System Boot Loader**: Refactored the boot sequence to support a high-contrast "Laboratory White" theme for Light Mode compatibility.
- **Identity Streamlining**: Removed manual `ID_Prefix` selection in favor of the earned Verification Stamp system.

### Fixed
- **Quantity "Jumping" Bug**: Resolved an issue where clicking the decrement button in the Vault would cause the quantity to increase due to relative delta addition.
- **Theme Synchronization**: Fixed a bug where the `SystemBootLoader` on the profile page would default to Dark Mode even when the user's preference was set to Light.
- **API Filter Resilience**: Updated the product API to correctly handle `ALL` status requests for the new Dictionary view.
- **Price Formatting**: Standardized `.toLocaleString()` across all catalog views for professional currency rendering.

### Challenges Faced
- **State Delta Conflict**: Encountered a challenge where passing relative deltas (+1/-1) to the cart state caused string concatenation and incorrect math. Solved by moving to absolute value replacement and strict number casting.
- **Bento Grid Cropping**: Balancing the high-impact "fill" look of the Bento grid with the need to see the entire diecast model. Resolved by implementing dynamic `object-contain` logic within the relative containers.
- **Hydration Theme Sync**: Managing the "System Boot" visual state before the user's profile theme had fully loaded from the database. Solved by passing the profile theme prop directly to the shared loader component.

---

## [2026-02-01] - Journal Cinematic Overhaul & Production Resilience

### Added
- **Cinematic Journal Header**: Implemented a high-impact header for journal entries that transitions from a grayscale cover image to an auto-playing cinematic video.
- **Manifest Card Preview**: Added a 1:1 visual preview of the journal grid card within the Admin Preview HUD.
- **Split Media Staging**: Redesigned Admin Journal forms with dedicated staging slots for Slot_01 (Static Cover) and Slot_02 (Hover Cinematic).
- **Video Readiness Logic**: Integrated `onCanPlay` event listeners to prevent "black screen" transitions by keeping the cover image visible until the video buffer is ready.

### Changed
- **Journal Media Display**: Refactored component to support `autoPlay` modes and layered the image on top of the video for smoother cross-fading.
- **Genre Synchronization**: Aligned the public journal filter with the Admin Enum settings (`CLASSIC_VINTAGE`, `RACE_COURSE`, etc.).

### Fixed
- **Next.js 15 Dynamic Routes**: Resolved "Entry Not Found" errors by correctly awaiting the `params` Promise in `[slug]` and `[id]` routes.
- **Broken Image Tags**: Fixed a bug where video URLs were being rendered in `<img>` tags due to strict regex anchors failing on query parameters.
- **Media Playback**: Resolved issues where videos remained black or failed to trigger on hover by implementing explicit ref-based playback controls.
- **Prisma Update Validation**: Fixed a `PrismaClientValidationError` by stripping non-schema fields (`imageUrl`, `videoUrl`) from the update payload.
- **Build Time Timeouts**: Addressed `ETIMEDOUT` errors during `next build` by implementing connection timeout guidance for serverless database cold starts.

---

## [2026-01-30] - Digital Collector ID & Archive Overhaul

### Added
- **Cinematic Journal Header**: Implemented a high-impact header for journal entries that transitions from a grayscale cover image to an auto-playing cinematic video.
- **Manifest Card Preview**: Added a 1:1 visual preview of the journal grid card within the Admin Preview HUD.
- **Split Media Staging**: Redesigned the Admin Journal forms with dedicated staging slots for Slot_01 (Static Cover) and Slot_02 (Hover Cinematic).
- **Auto-Routing Media Logic**: Implemented a robust detection system that automatically routes uploaded files to the correct media slot based on file extension, even with query parameters.

### Changed
- **Journal Media Display**: Refactored the component to support `autoPlay` modes and added a `poster` attribute to prevent "black box" flickering during video loads.
- **Admin Preview HUD**: Enhanced the preview interface with a "View Live Site" link and a "Modify Entry" shortcut.
- **Journal Grid Logic**: Updated the public journal page to correctly handle the "Feature" card layout and synchronized the genre filter with the Admin settings.

### Fixed
- **Next.js 15 Dynamic Routes**: Resolved "Entry Not Found" errors by correctly awaiting the `params` Promise in `[slug]` and `[id]` routes.
- **Broken Image Tags**: Fixed a bug where video URLs were being rendered in `<img>` tags due to overly strict regex anchors.
- **Media Playback**: Resolved issues where videos remained black or failed to trigger on hover by implementing explicit ref-based playback controls.
- **Media Display Layering**: Fixed a "black screen" issue on hover by layering the static cover image over the video element and utilizing the `poster` attribute for seamless transitions.
- **Journal Header Simplification**: Updated the single journal entry page to display only the static cover image in the header, resolving visibility issues and improving readability as requested.
- **Genre Synchronization**: Synchronized the public journal genre filter with the Admin panel settings and implemented robust filtering logic to handle published status and genre matching.
- **Prisma Validation**: Fixed a `findUnique` error where `slug` was being passed as `undefined` due to the sync-dynamic-api change in Next.js 15.
- **Prisma Update Validation**: Fixed a `PrismaClientValidationError` in the Journal API by stripping non-schema fields (`imageUrl`, `videoUrl`, `id`, etc.) from the update payload.
- **Genre Filtering**: Fixed a bug where the public genre filter was disconnected from the Admin settings and was displaying unpublished drafts.
- **Grid Layout**: Corrected a CSS Grid spanning issue where the featured journal entry was not occupying the full width of the row.

---

## [2026-01-30] - Digital Collector ID & Archive Overhaul

### Added
- **Digital Collector ID**: Implemented a personalized, F1-inspired identity card (`CollectorIDCard`) displaying collector name, bio, and verification stamps.
- **Collection Stats**: Added a high-contrast `StatsPanel` to track total models and rare editions directly on the dashboard.
- **My Archive Page**: Created a dedicated collection management route (`/access/collection`) for detailed viewing and curation of acquired exhibits.
- **Car Nicknames**: Users can now assign custom nicknames to their diecast models via the new interactive `CollectionItem` interface.
- **Wishlist Support**: Updated schema with `WishlistItem` model to support the upcoming "Hunting List" feature.
- **Dashboard Data Aggregator**: Created a centralized API (`/api/user/dashboard-data`) to efficiently fetch profile, stats, and collection data in a single request.
- **Profile Customization API**: Implemented a profile update endpoint (`/api/user/profile`) to handle collector identity and theme preferences.
- **Nickname API**: Added a specific endpoint (`/api/collection/[itemId]`) to handle individual item personalization.

### Changed
- **User Dashboard**: Overhauled the main access page to focus on identity and collection metrics, replacing the static welcome block with the new ID system.
- **Prisma Schema**: Enhanced `Product`, `User`, and `OrderItem` models to support personalization, rarity tracking, and the new identity layer.
- **Theming System**: Integrated dashboard-specific light/dark mode persistence based on user profile settings stored in the database.
- **Data Fetching**: Updated the dashboard to automatically sync/create a user profile record on the first visit.

### Fixed
- **File Organization**: Relocated `CollectionItem` to the components directory and consolidated API logic into the standard `app/api` structure for better Next.js App Router compliance.
- **Import Paths**: Corrected component references in the collection page to match the new directory structure.

### Removed
- **Redundant Logic**: Deleted misplaced API routes (`src/components/dashboard/route.js`) and duplicate component files (`src/app/access/CollectionItem.jsx`) to maintain project cleanliness.

---

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