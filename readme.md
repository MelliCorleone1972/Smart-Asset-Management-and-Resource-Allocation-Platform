# Smart Asset Management and Resource Allocation Platform 📦

![Platform Status](https://img.shields.io/badge/Status-Completed-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

A full-stack, real-time inventory and resource allocation platform developed for the **Cultural Council of IIT Roorkee**. This platform eliminates fragmented communication channels by providing a centralized system for inventory tracking, asset booking, approval workflows, and operational analytics.

---

## Project Overview

Organizations rely on shared resources like DSLR cameras, studio lighting, audio systems, and stage props. This platform digitizes the entire lifecycle of these assets. It features a role-based architecture allowing students (consumers) to securely browse and request equipment, while administrators can track inventory health, approve/reject bookings, and monitor operational analytics in real-time.

---

## Feature List

### Core System Features

- **Secure Authentication:** JWT-based user authentication and session management.
- **Role-Based Access Control (RBAC):** Strict isolation between `admin` workflows and standard `consumer` (student) capabilities.

### Admin Dashboard Features

- **Full Inventory CRUD:** Register, edit, and delete assets instantly.
- **Dynamic Categorization:** Group equipment into predefined or custom categories (e.g., _DSLR Cameras, Audio Systems, Props_).
- **Approval Engine:** Review incoming student requests with one-click `Issue`, `Reject`, or `Mark Returned` actions.
- **Operational Analytics:** Real-time metrics displaying total unique items, active bookings, and pending action items.
- **System-Wide Auditing:** Search and filter the entire platform's booking history by student name.

### Student (Consumer) Features

- **Equipment Catalog:** Browse available campus resources with live inventory counts.
- **Smart Search & Filter:** Instantly filter equipment by name, category, or description.
- **Dynamic Booking:** Request specific quantities of an asset for designated date durations.
- **Borrowing History:** A dedicated profile dashboard to track active requests, past borrows, and current approval statuses.

---

## Technology Stack

**Frontend (Client)**

- **Library:** React.js
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM
- **HTTP Client:** Axios

**Backend (Server)**

- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JSON Web Tokens (JWT) & bcrypt.js
- **Middleware:** CORS, custom role-verification middleware

**Database**

- **Engine:** MySQL
- **Driver:** `mysql2` (Promise-based)

---

## Setup Instructions

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- Git

### 1. Clone the Repository

```bash
git clone [https://github.com/MelliCorleone1972/Smart-Asset-Management-and-Resource-Allocation-Platform.git](https://github.com/MelliCorleone1972/Smart-Asset-Management-and-Resource-Allocation-Platform.git)
cd Smart-Asset-Management-and-Resource-Allocation-Platform
```
