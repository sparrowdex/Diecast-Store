# Project Requirements Document: Diecast Store

## 1. Software Requirements

### From the Developer’s side:

*   **Operating System:** The application is platform-independent, allowing for development on Windows, macOS, or Linux.
*   **Frameworks & Languages:**
    *   **Core Framework:** Next.js (a React framework) is used for the entire application, providing server-side rendering, API routes, and a component-based architecture.
    *   **Backend:** The backend logic is built with **Node.js** and **TypeScript/JavaScript** using Next.js API routes and Server Actions.
    *   **Frontend:** The user interface is built using **React**, **TypeScript/JavaScript**, and styled with **Tailwind CSS**.
*   **Database:** The project uses **PostgreSQL** as its database, managed through the **Prisma ORM** for type-safe database access and schema migrations.
*   **Key Technologies & Services:**
    *   **Authentication:** User management (login, registration, session handling) is handled by **Clerk**.
    *   **Payment Processing:** Financial transactions are processed by **Razorpay**.
    *   **File/Media Uploads:** Product images and videos are managed via **Uploadthing**.

### From the Client’s (End-User) side:

*   **User-Friendly Interface:** The website must be intuitive and easy to navigate for customers to browse products, manage their cart, and complete purchases. The admin dashboard must be clear and efficient for managing store operations.
*   **Secure:** All user data, especially authentication and payment information, must be handled with the highest security standards. Sensitive operations are performed on the server-side to prevent client-side exposure.
*   **Efficient Performance:** The website must load quickly and respond smoothly to user interactions to provide a seamless shopping experience.
*   **Responsive Design:** The application must be fully functional and visually appealing across all common devices, including desktops, tablets, and smartphones.

## 2. System Requirements

### From the Developer’s side:

*   **Processor:** Modern multi-core processor (e.g., Intel Core i5 8th Gen+, AMD Ryzen 5+, Apple M1+).
*   **Memory (RAM):** A minimum of 8 GB, with 16 GB recommended for running the development server, database, and other tools smoothly.
*   **Hard Disk Space:** At least 20 GB of free space on a Solid State Drive (SSD) is recommended for the project files, dependencies (`node_modules`), and local database instance.
*   **Software:** Node.js (v18+), a package manager (npm), and a Git client.

### From the Client’s (End-User) side:

*   **Web Browser:** Any modern, up-to-date web browser (e.g., Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge).
*   **Internet Connection:** A stable internet connection is required to access the website.
*   **Operating System:** The website is OS-independent and accessible through a web browser on any modern operating system.

## 3. Functional Requirements

### Customer-Facing:

*   **User Account Management:** Users must be able to register for a new account, log in, and log out. The system uses Clerk for authentication.
*   **Product Catalog & Viewing:** The system must display all available diecast models in a catalog. Users can click on a product to view its detailed page with descriptions, price, and multiple images/videos.
*   **Product Search:** Users should be able to search for specific products.
*   **Shopping Cart:** Users must be able to add products to a shopping cart, adjust quantities, and remove items.
*   **Checkout Process:** The system must provide a multi-step checkout form for users to enter shipping and contact information.
*   **Payment:** The system must integrate with Razorpay to allow users to securely pay for their orders.
*   **Order History:** Registered users must be able to view a history of their past orders and their current status.

### Administrator-Facing (Admin Dashboard):

*   **Admin Authentication:** Access to the admin dashboard must be restricted to authorized administrators.
*   **Inventory Management:** The admin must be able to add new products, edit existing product details (name, price, description, stock), and upload associated images/videos. The system automatically decrements stock upon a successful purchase.
*   **Order Management:** The admin must be able to view all customer orders, check their payment status, and update the fulfillment status (e.g., 'Shipped', 'Delivered').
*   **Featured Product Management:** The admin must have the ability to select and manage products that are featured on the homepage.
*   **Journal/Blog Management:** The admin must be able to create, edit, and publish articles or news updates for the store's journal.

## 4. Non-Functional Requirements

### Product Requirements:

*   **Performance:** The web pages should load quickly, with an emphasis on optimizing image delivery and server response times, leveraging Next.js features like Server-Side Rendering (SSR).
*   **Reliability:** The system must be reliable, ensuring that order data is processed accurately and that inventory levels are updated in real-time to prevent overselling. Database transactions are used for operations like stock deduction to ensure data integrity.
*   **Usability:** The interface should be clean, modern, and intuitive for both customers and administrators. Navigation should be straightforward, and the checkout process must be simple to minimize cart abandonment.
*   **Scalability:** The system is designed to handle growth in users and orders, as outlined in the `DATABASE_SCALING.md` document, which plans for future database performance optimization.

### Security Requirements:

*   **Authentication & Authorization:** The system uses Clerk to enforce strong authentication. Access to admin-only routes and actions is strictly controlled on the server.
*   **Payment Security:** No sensitive payment details (like credit card numbers) are stored on the server. All payment processing is handled by Razorpay, a PCI-compliant provider. Server-side signature verification is used to prevent tampering.
*   **Data Security:** All sensitive keys and credentials (database connection strings, API secrets) are stored in environment variables and are not exposed to the client-side.

### Safety & Recovery:

*   **Database Backup:** The PostgreSQL database should be backed up regularly to prevent data loss in case of a system failure. This is a crucial operational requirement managed at the hosting provider level.
