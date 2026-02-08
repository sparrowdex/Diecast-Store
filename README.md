# 🏎️ Pit Wall Telemetry — Diecast Exhibit Store

A high-performance e-commerce platform for diecast collectors, inspired by F1 telemetry and automotive precision. This application manages the entire lifecycle of high-value exhibits, from acquisition in the "Vault" to real-time logistics tracking.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Prisma with Neon (PostgreSQL)
- **Authentication**: Clerk (RBAC for Admin/Collector roles)
- **Payments**: Razorpay (Mock/Production hybrid)
- **Styling**: Tailwind CSS v4 & Framer Motion
- **Logistics**: Shiprocket (Mocked Service Layer)
- **Documents**: jsPDF for Technical Manifestos

## 🚀 Key Features

### 🏁 Collector Experience
- **Digital Collector ID**: Personalized F1-inspired identity cards with verification stamps and collection stats.
- **The Vault**: A stock-aware cart system with `localStorage` persistence and real-time inventory locking.
- **Cinematic Journal**: A hybrid media feed featuring grayscale-to-video transitions for exhibit storytelling.
- **Delivery Telemetry**: A visual "Race Track" progress bar (GRID_POSITION → PIT_LANE → ON_TRACK → CHECKERED_FLAG) for real-time order tracking.
- **Technical Manifesto**: Automated PDF generation for acquisition documents upon successful purchase.

### 🛠️ Admin "Pit Wall" Telemetry
- **Fleet Management**: Master catalog control with Genre-based filtering (Classic, Race Course, etc.).
- **Logistics Action Center**: Integrated fulfillment card for package metrics, AWB generation, and label printing.
- **SLA Monitoring**: Priority-based order sorting (Critical, Urgent, New) to ensure fulfillment speed.
- **Critical Fuel Alerts**: Real-time stock monitoring to prevent "Decommissioned Exhibits" (Out of Stock).

## 📦 Getting Started

### 1. Clone & Install
```bash
git clone <repository-url>
cd diecast-store
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="your-postgresql-url"
DATABASE_URL_UNPOOLED="your-direct-postgresql-url"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# App Mode
NEXT_PUBLIC_PAYMENT_MODE="mock" # or "production"

# Shiprocket
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=
NEXT_PUBLIC_SHIPMENT_MODE="mock" # or "production"
```

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development
```bash
npm run dev
```

## 🗺️ Project Structure

- `/src/app`: Next.js App Router (Routes & Server Actions)
- `/src/components`: Reusable UI components (DeliveryTracker, FulfillmentCard, etc.)
- `/src/lib`: Core logic (Shiprocket Mock, Prisma Client, Payment Utils)
- `/prisma`: Database schema and configuration

## 📜 Documentation

For detailed internal workflows, refer to:
- ORDER_FLOW_GUIDE.md: End-to-end acquisition and logistics logic.
- CHANGELOG.md: Detailed history of production hardening and feature releases.
- TODO.md: Current roadmap and database resilience tasks.

## ⚖️ License

This project is bootstrapped with `create-next-app`. All custom F1-inspired UI components and telemetry logic are proprietary to the Diecast Store project.

---
*Last Updated: February 2026*