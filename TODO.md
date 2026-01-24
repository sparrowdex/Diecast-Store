# Database Resilience Plan

## Overview
Add try-catch blocks to server-side database queries to prevent frontend crashes when database connection is unstable.

## Tasks
- [x] Add error handling to src/app/page.js for featured exhibits, archive, and new arrivals
- [x] Add error handling to src/app/catalog/page.js for product fetching
- [x] Add error handling to src/app/product/[id]/page.js for product details
- [x] Test that frontend loads with empty data when database fails
- [ ] Integrate Shipping API (e.g., Shiprocket/Shippo) to automate tracking number generation and label printing
