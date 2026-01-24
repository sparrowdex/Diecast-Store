# System Design: Diecast Store E-commerce Platform (Technical Deep-Dive)

## 1. Overview & Architectural Goals

This document provides a detailed technical overview of the Diecast Store, a bespoke full-stack e-commerce application. The platform is built with a modern technology stack chosen to meet specific architectural goals.

This is a **custom-coded solution**, not a template, designed for a unique brand experience and optimal performance.

### Architectural Goals:

*   **User-Perceived Performance:** Prioritize fast load times (Time to First Byte, First Contentful Paint) to maximize user engagement and conversion rates. This is achieved through Server-Side Rendering (SSR), Static Site Generation (SSG), and a global Edge Network.
*   **Scalability & Resilience:** The architecture must handle traffic spikes without manual intervention or performance degradation. This is achieved through a serverless backend and a scalable database.
*   **Developer Velocity & Maintainability:** Use a strongly-typed, component-based, and monolithic repository (monorepo) approach to streamline development, reduce bugs, and simplify long-term maintenance.
*   **Cost-Effectiveness:** Leverage serverless technologies to minimize infrastructure overhead and align operational costs with actual usage.

## 2. Frontend Architecture

The frontend is a responsive and interactive web application built with Next.js and styled with Tailwind CSS, emphasizing performance and a modern user experience.

*   **Framework: Next.js (App Router)**
    *   **Rendering Strategy:** Utilizes a hybrid rendering model. Static pages (like Privacy Policy) are generated at build time (SSG), while dynamic pages (like product listings) are server-side rendered (SSR) for optimal SEO and fast initial loads.
    *   **Component Model:** Leverages React Server Components (RSCs) and Client Components, strategically splitting work between the server and client to minimize the client-side JavaScript bundle size.
    *   **Performance Optimization:** Uses `next/image` for automatic image optimization (resizing, format conversion) and `next/link` for client-side navigation prefetching.
    *   **UI Composition:** The UI is composed of reusable components located in `src/components`, including sophisticated elements like a `BentoGrid` and `CarCard`, which contribute to a unique and engaging user interface.

*   **State Management**
    *   **React Context API:** Global client-side state, such as the shopping cart, is managed via the React Context API (`src/context/CartContext.js`). This avoids the need for external libraries for current requirements but can be extended with `Zustand` or `Redux` if state complexity grows.

*   **Styling: Tailwind CSS**
    *   A utility-first CSS framework enables rapid, consistent, and custom UI development. The configuration is managed in `postcss.config.mjs` and `tailwind.config.js`.

## 3. Backend Architecture

The backend is built as a set of serverless functions via Next.js API Routes, providing a scalable and robust foundation for the application's logic.

*   **API Design: RESTful Principles**
    *   The API, located in `src/app/api`, follows RESTful conventions for structuring endpoints. Resources like `products`, `orders`, and `journal` have dedicated routes for Create, Read, Update, and Delete (CRUD) operations.

*   **Serverless Functions on Vercel**
    *   Each API route is deployed as an isolated Vercel Function. This provides auto-scaling, high availability, and fault isolation. If one endpoint experiences an error, it does not impact the rest of the system.

*   **Security & Webhooks**
    *   **Environment Variables:** All sensitive keys (database URLs, payment provider secrets) are managed securely through environment variables within the Vercel dashboard, separating configuration from code.
    *   **Payment Integration:** The Razorpay integration (`src/app/api/webhook/razorpay/route.ts`) uses cryptographically signed webhooks to asynchronously and securely update order and payment statuses. This ensures a reliable order-processing flow even if the user closes their browser post-payment.
    *   **Input Validation:** (Recommended) Implement input validation on all API routes using a library like `Zod` to protect against malformed data and common vulnerabilities.

*   **File Handling**
    *   File uploads are managed through UploadThing (`src/app/api/uploadthing/core.js`), a third-party service that provides a robust and scalable solution for handling user-generated media like product images and videos.

## 4. Database Design

The data layer uses a PostgreSQL database, with Prisma serving as a next-generation, type-safe Object-Relational Mapper (ORM).

*   **Database Provider: PostgreSQL**
    *   The database is specified as PostgreSQL in the Prisma schema (`provider = "postgresql"`). It is a highly reliable and feature-rich relational database suitable for e-commerce workloads.

*   **ORM: Prisma**
    *   **Schema as Source of Truth:** The `prisma/schema.prisma` file provides a canonical, easy-to-read definition of the data models (`Product`, `Order`, `JournalEntry`, etc.) and their relationships.
    *   **Type-Safe Client:** Prisma generates a client that provides fully typed database access, enabling autocompletion and preventing data-related errors during development.
    *   **Migrations:** `prisma migrate` is used to manage database schema evolution in a safe, repeatable manner. All migration history is tracked in the `prisma/migrations` directory.

*   **Data Modeling**
    *   The schema defines clear relationships between models, such as the one-to-many relationship between `Order` and `OrderItem`, and a connecting relationship between `OrderItem` and `Product`.
    *   It includes rich data types, including enums (`CollectionStatus`, `Genre`) and native array types for product `images`.

## 5. Deployment & CI/CD Pipeline

The application is deployed and hosted on Vercel, a platform purpose-built for Next.js applications that provides a seamless CI/CD workflow.

*   **Continuous Integration/Continuous Deployment (CI/CD)**
    *   Vercel is linked to the project's Git repository. Every `git push` automatically triggers a build and deployment.
    *   **Preview Deployments:** Every pull request generates a unique, shareable preview URL. This allows for thorough review and testing of changes in a production-like environment before merging to the main branch.
    *   **Zero-Downtime Deployments:** Live traffic is automatically transitioned to the latest deployment without any service interruption.

*   **Infrastructure & Global Performance**
    *   **Vercel Edge Network:** Static assets (HTML, CSS, images) are automatically cached on Vercel's global Edge Network, ensuring minimal latency for users worldwide.
    *   **Vercel Functions:** The serverless API routes are deployed to the region closest to the database to minimize query latency.
