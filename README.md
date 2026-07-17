# MediBlink: Ultra-Fast Healthcare Delivery Network

MediBlink is a comprehensive, ultra-fast healthcare delivery and telehealth platform. Designed with a micro-fulfillment (dark store) architecture, the platform enables rapid 10-20 minute delivery of medicines and healthcare essentials, alongside integrated telehealth consultations.

## Project Overview

The healthcare supply chain often suffers from significant delays. MediBlink solves this by bridging the gap between local pharmacies, delivery riders, and patients. It acts as an end-to-end ecosystem where a patient can consult a doctor via video call, upload a prescription, and receive their medication almost instantly.

The platform is regionally localized (currently tailored for Agra and Firozabad) and supports an extensive catalog of over 500+ SKUs across Over-The-Counter (OTC), Chronic Care, Antibiotics, and Veterinary medicines.

## Core Modules

The application is divided into five distinct operational dashboards:

1. **Patient App**: A consumer-facing storefront to search and purchase medicines, view nearby hospitals, and launch instant video consultations with local doctors or veterinary specialists.
2. **Picker App**: A dashboard for pharmacy staff inside the micro-fulfillment center to instantly receive orders, verify prescriptions, and pack items.
3. **Rider App**: A live delivery routing application for delivery partners to pick up packed orders and navigate to the patient's location.
4. **Admin Headquarters**: A high-level analytics dashboard tracking live inventory, total revenue, items sold, and critical low-stock alerts.
5. **Smart Rx Scanner**: An AI-simulated prescription scanner that automatically reads doctor prescriptions and securely adds the required medicines to the cart.

## Technology Stack

- **Frontend**: React.js, Vite
- **Styling**: Tailwind CSS 
- **State Management**: Zustand
- **Backend & Database**: Supabase (PostgreSQL)
- **Real-Time Data**: Supabase Realtime WebSockets
- **Deployment**: Vercel

## Key Technical Features

- **Hybrid Database Architecture**: The platform seamlessly queries a live Supabase PostgreSQL database. If the cloud connection fails, it intelligently falls back to an internal massive 500+ item local database to ensure zero downtime.
- **Automated Inventory Tracking**: Custom SQL triggers automatically deduct stock from the inventory table the moment an order is fulfilled.
- **Real-Time Order Syncing**: Orders placed by patients instantly appear on the Picker and Rider dashboards via WebSocket connections without requiring page refreshes.

## Getting Started (Local Development)

### Prerequisites
- Node.js installed on your machine
- A Supabase account (for database hosting)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd medico
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize the Database:**
   Copy the contents of `schema.sql` and run it in your Supabase SQL Editor. This will generate the required tables, triggers, and seed the massive medicine database.

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Access the application at `http://localhost:5173`.

## Deployment

This project is optimized for deployment on Vercel:
1. Push your code to a GitHub repository.
2. Import the repository into Vercel.
3. Add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the Vercel Environment Variables.
4. Deploy.

---
*Built to make healthcare faster, simpler, and more accessible.*
