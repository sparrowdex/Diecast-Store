# Database Resilience Plan

## Overview
Add try-catch blocks to server-side database queries to prevent frontend crashes when database connection is unstable.

## Tasks
- [x] Add error handling to src/app/page.js for featured exhibits, archive, and new arrivals
- [ ] Add error handling to src/app/catalog/page.js for product fetching
- [ ] Add error handling to src/app/product/[id]/page.js for product details
- [ ] Test that frontend loads with empty data when database fails
