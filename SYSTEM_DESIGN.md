
# System Design: Diecast Store E-commerce Platform

## 1. Overview

This document outlines the system design for the Diecast Store, a bespoke full-stack e-commerce application. The platform is built from the ground up using a modern, high-performance technology stack, ensuring a fast user experience, robust scalability, and maintainability.

This is a **custom-coded solution**, not a generic template, which allows for unique features and a brand-aligned user experience. The architecture prioritizes performance, scalability, and a seamless developer workflow.

**Core Technologies:**

*   **Frontend:** Next.js (React Framework) & Tailwind CSS
*   **Backend:** Next.js API Routes (Serverless Functions)
*   **Database:** PostgreSQL with Prisma ORM
*   **Deployment:** Vercel

## 2. Frontend Architecture

The frontend is a fast, modern, and responsive web application built with Next.js.

*   **Framework: Next.js**
    *   **Performance:** Next.js enables a blazingly fast user experience through features like Server-Side Rendering (SSR) and Static Site Generation (SSG). Product pages and marketing content can be pre-rendered for near-instantaneous load times, which is crucial for customer engagement and SEO.
    *   **App Router:** The application uses the latest Next.js App Router, which supports layouts, server components, and granular caching for optimizing performance.
    *   **Component-Based Architecture:** The UI is built with reusable React components, ensuring a consistent design and efficient development.

*   **Styling: Tailwind CSS**
    *   A utility-first CSS framework is used for rapid and consistent UI development.
    *   It allows for creating a bespoke design system without being locked into a pre-defined UI kit.
    *   The `postcss.config.mjs` and `tailwind.config.js` are configured for the project's specific needs.

*   **Key Frontend Features:**
    *   Dynamic product catalog and detail pages.
    *   Shopping cart and checkout flow.
    *   User account management (orders, settings).
    *   Admin dashboard for managing products, orders, and content.
    *   A blog/journal section for content marketing.

## 3. Backend Architecture

The backend logic is implemented using Next.js API Routes, which are deployed as serverless functions.

*   **Serverless Functions:**
    *   Each API route (e.g., for products, orders, payments) is a separate serverless function.
    *   **Scalability:** This architecture is highly scalable. Vercel automatically manages the infrastructure, scaling the functions up or down based on traffic. This means the site can handle sudden surges in traffic without manual intervention.
    *   **Cost-Effective:** You only pay for the compute time you use, making it a cost-effective solution.

*   **API Routes:**
    *   The `src/app/api` directory contains all the backend endpoints.
    *   **`products`:** Handles creating, reading, updating, and deleting products.
    *   **`orders`:** Manages the order lifecycle.
    *   **`create-payment-intent`:** Integrates with the payment provider (Razorpay).
    *   **`webhook`:** Listens for events from the payment provider to update order statuses.
    *   **`journal`:** Manages blog/journal entries.
    *   **`uploadthing`:** Handles file uploads for product images and other media.

*   **Authentication & Authorization:**
    *   The backend can be configured to handle user authentication and authorization, protecting sensitive routes and data.

## 4. Database Design

The application uses a PostgreSQL database, with Prisma as the Object-Relational Mapper (ORM).

*   **Database: PostgreSQL**
    *   A powerful, open-source object-relational database system with a strong reputation for reliability, feature robustness, and performance.

*   **ORM: Prisma**
    *   **Type Safety:** Prisma provides a type-safe database client, which helps prevent common errors and improves developer productivity.
    *   **Schema Management:** The database schema is defined in the `prisma/schema.prisma` file, which serves as a single source of truth.
    *   **Migrations:** Prisma's migration tool allows for easy and safe database schema changes over time.
    *   **Scalability:** The combination of Prisma and a robust PostgreSQL database provides a solid foundation for scaling the application's data layer. Connection pooling can be handled efficiently, ensuring the database can handle many concurrent users.

## 5. Deployment & CI/CD

The application is deployed on Vercel, a platform designed for modern web applications.

*   **Platform: Vercel**
    *   Vercel is built by the creators of Next.js, so it offers a seamless and highly optimized deployment experience.
    *   It connects directly to the project's Git repository.

*   **Continuous Integration & Continuous Deployment (CI/CD):**
    *   Every `git push` to the main branch can trigger a new deployment.
    *   **Zero-Downtime Deployments:** Vercel ensures that the site is always available, even during deployments.
    *   **Preview Deployments:** Every pull request gets its own preview URL, allowing you to review changes in a production-like environment before merging them.

*   **Scalability:**
    *   Vercel's global edge network caches static assets and server-rendered pages, ensuring fast load times for users anywhere in the world.
    *   The serverless functions scale automatically, as mentioned in the backend section. This combination of a global edge network and auto-scaling backend functions means the site is incredibly scalable and resilient.
