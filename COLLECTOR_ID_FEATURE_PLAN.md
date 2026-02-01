# Digital Collector ID Feature Plan

This document outlines the plan for overhauling the user dashboard into a "Digital Collector ID," as discussed.

## 1. Concept: The "Digital Collector ID"

The goal is to transform the standard user dashboard into a personalized, high-end "Digital Collector ID" that feels like a physical credential. This involves creating a new layout focused on identity, collection statistics, and gamified progress tracking, with controlled customization options for the user.

## 2. High-Level Implementation Plan

The implementation is broken down into three main areas: Backend Data Model, Backend API Endpoints, and Frontend Implementation.

### 2.1. Backend Modifications (Data Model - `prisma/schema.prisma`)

To support the new features, the following changes will be made to the Prisma schema:

-   **`User` Model:**
    -   Add `collectorName: String?` for the customizable ID name.
    -   Add `bio: String?` for the 160-character biography. A backend validation rule will enforce the length limit.
    -   Add `stamp: String?` to store the user's selected "Verified Collector" stamp design.
    -   Add `fontPreference: String?` to store the chosen font.
    -   Add `progressRingColor: String?` to store the chosen color for progress rings.
    -   Add `theme: String?` to store 'light' or 'dark' mode preference.

-   **`Product` Model:**
    -   Confirm or add a `category: String` field to group items (e.g., "F1", "Classic").
    -   Add `isRare: Boolean @default(false)` to flag "Rare Editions" for the stats panel.

-   **`OrderItem` Model:**
    -   Add `nickname: String?` to allow users to set a custom name for a specific car they own.

### 2.2. Backend Modifications (API Endpoints)

New API endpoints will be created to manage the new data and functionality:

-   **`PUT /api/user/profile`:** An endpoint for an authenticated user to update their `collectorName`, `bio`, `stamp`, and theme preferences (`fontPreference`, `progressRingColor`, `theme`).
-   **`PUT /api/collection/:itemId`:** An endpoint to update the `nickname` of a specific item in the user's collection.
-   **`GET /api/user/dashboard-data`:** A new endpoint that aggregates all necessary data for the dashboard in a single call. This will include:
    -   The user's profile data (including all new fields).
    -   The user's collection of `OrderItems` (with nicknames).
    -   Calculated stats: `Total Models Owned`, `Active Series Count`, `Rare Editions`.
    -   Category completion percentages for the progress rings.

### 2.3. Frontend Implementation

The frontend will be updated to build the new UI and integrate the new functionality.

-   **New Component-Based Structure:**
    -   `CollectorIDCard.js`: Displays the user's identity, bio, avatar, and stamp.
    -   `StatsPanel.js`: Renders the key collection metrics.
    -   `AcquisitionFeed.js`: The grid of collected models, now with editable nicknames.
    -   `ProgressRings.js`: Renders SVG rings based on fetched category completion data.

-   **New Custom Settings Page:**
    -   Instead of modifying Clerk's default UI, a new page will be created at `src/app/access/profile/page.jsx`.
    -   This page will host the forms and controls for managing the "Collector ID" profile (Collector Name, Bio, Stamp) and theme preferences (Font, Colors, Light/Dark Mode). (the light/dark mode is only for the dashboard, not the entire app)

-   **Navigation Update:**
    -   The user-facing navigation will be updated to include two distinct links:
        -   "**Account**" -> `/access/settings` (the existing Clerk page).
        -   "**Profile**" -> `/access/profile` (the new custom settings page).

-   **State Management & Theming:**
    -   **React Context** will be used to manage theme and profile settings globally. A `SettingsContext` will provide the current settings (e.g., theme, font) to all components.
    -   **CSS Variables** will be used to apply these settings dynamically. The root layout will set CSS variables based on the context values, allowing for efficient, app-wide theme switching.
