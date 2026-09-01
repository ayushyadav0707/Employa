<div align="center">

# ⚡ Employa
### *Every workday, perfectly aligned.*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-v5-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Deployment](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel)](https://employa-hrms.vercel.app/)

**Enterprise-Grade Human Resource Management System built for the Odoo Hackathon 2026**

🌐 **Live Deployment**: **[https://employa-hrms.vercel.app/](https://employa-hrms.vercel.app/)**

[Explore Live Demo](#-judge--evaluator-quick-test-credentials) • [Architecture](#-system-architecture--workflow-diagrams) • [Modules](#-core-modules--features) • [Installation](#-getting-started)

---
</div>

## 📌 Executive Summary

**Dayflow HRMS** is an integrated human resource management platform designed following strict Odoo ERP workflow standards. It delivers a unified workplace experience spanning multi-role authentication, interactive employee directories, a real-time stopwatch attendance engine, leave approval matrices, and salary structure configurations with automated payslip generation.

---

## 📐 System Architecture & Workflow Diagrams

### 1. 🏗️ High-Level System Architecture

```mermaid
graph TD
    subgraph Client Tier
        UI["🖥️ Modern Responsive Web App (Next.js App Router)"]
        Components["🎨 Tailwind CSS + Lucide Icons System"]
    end

    subgraph Security & Middleware Tier
        MW["🛡️ Strict Route Middleware (RBAC Guard)"]
        JWT["🔐 Custom JWT Session Token & Bcrypt Auth"]
    end

    subgraph Business Logic Tier
        AuthMod["👤 Auth & Company Onboarding"]
        EmpMod["👥 Employee Directory & Profiles"]
        AttMod["⏱️ Attendance & Live Clock Engine"]
        LeaveMod["🌴 Leave Management & Approvals"]
        PayMod["💵 Payroll & Salary Computation"]
    end

    subgraph Persistence Tier
        ORM["⚡ Prisma ORM (Client v6)"]
        DB[("🗄️ SQLite Database (prisma/dev.db)")]
    end

    UI --> MW
    MW --> JWT
    JWT --> AuthMod & EmpMod & AttMod & LeaveMod & PayMod
    AuthMod & EmpMod & AttMod & LeaveMod & PayMod --> ORM
    ORM --> DB
```

---

### 2. ⏱️ Real-Time Attendance & Clock-In Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Employee
    actor Admin
    participant Clock as ClockWidget UI
    participant Service as Attendance Service
    participant DB as SQLite / Prisma

    Employee->>Clock: Click "Clock In" (Office HQ / Remote)
    Clock->>Service: Initialize Session + Start Live Stopwatch
    Service->>DB: Upsert Attendance Record (Status: Present)
    
    opt Break Management
        Employee->>Clock: Click "Take Break"
        Clock->>Service: Pause timer, increment break duration
        Employee->>Clock: Click "Resume Work"
        Clock->>Service: Resume live active ticker
    end

    Employee->>Clock: Click "Clock Out"
    Clock->>Service: Calculate Total Logged Hours
    Service->>DB: Update Record (checkOut timestamp, totalHours)

    opt HR Regularization
        Admin->>Service: Open Regularize Modal (Adjust punch / remarks)
        Service->>DB: Overwrite record with HR audit note
    end
```

---

### 3. 🌴 Leave Application & Approval Workflow

```mermaid
flowchart TD
    A["👤 Employee submits Leave Request<br/>(Type, Start Date, End Date, Reason)"] --> B{"Check Leave Balance<br/>(PTO ≥ Days or Sick ≥ Days?)"}
    B -- Insufficient Balance --> C["❌ Request Blocked / Validation Error"]
    B -- Sufficient Balance --> D["⏳ Status: PENDING<br/>Notification sent to HR Admin"]
    
    D --> E{"HR / Admin Review<br/>(/time-off Console)"}
    E -- Rejected --> F["🔴 Status: REJECTED<br/>Admin comment logged"]
    E -- Approved --> G["🟢 Status: APPROVED<br/>Deduct days from LeaveBalance"]
    
    G --> H["📅 Auto-reflects as 'LEAVE' in Attendance Calendar"]
    G --> I["💵 Synced with Payroll Engine for Leave Deductions"]
```

---

### 4. 🗄️ Database Entity-Relationship (ER) Model

```mermaid
erDiagram
    USER ||--o{ ATTENDANCE : "logs"
    USER ||--o{ LEAVE_REQUEST : "submits"
    USER ||--o| LEAVE_BALANCE : "has"
    USER ||--o| PAYROLL_CONFIG : "configured_with"

    USER {
        string id PK
        string loginId UK
        string email UK
        string password
        string role "ADMIN | EMPLOYEE"
        string name
        string phone
        string address
        string panNo
        string uanNo
        string bankAccount
        string jobTitle
        string department
        float salary
        boolean isFirstLogin
    }

    ATTENDANCE {
        string id PK
        string userId FK
        string date "YYYY-MM-DD"
        string checkIn
        string checkOut
        float totalHours
        string status "Present | Absent | Half-day | Leave"
        string location "HQ | Remote"
        int breakDurationMinutes
    }

    LEAVE_REQUEST {
        string id PK
        string userId FK
        string type "Paid | Sick | Unpaid"
        datetime startDate
        datetime endDate
        int allocationDays
        string reason
        string status "Pending | Approved | Rejected"
        string adminComment
    }

    LEAVE_BALANCE {
        string id PK
        string userId FK
        int paidTimeOff "default: 24"
        int sickTimeOff "default: 7"
    }

    PAYROLL_CONFIG {
        string id PK
        string userId FK
        int salary
        float taxPct "default: 10.0"
    }
```

---

## 👥 Team Division of Labor (4 Specialized Roles)

```mermaid
graph LR
    subgraph Odoo Hackathon Team Distribution
        D1["👤 Dev 1: Auth & UI Design System<br/>• JWT Session Auth<br/>• Global Sidebar Shell<br/>• Security Middleware"]
        D2["👤 Dev 2: Employee Management<br/>• Employee Directory<br/>• Profile Edit (PAN/UAN)<br/>• Onboarding Action"]
        D3["👤 Dev 3: Attendance & Clock Engine<br/>• Live Stopwatch Widget<br/>• Weekly/Daily Timesheets<br/>• Monthly Calendar & Admin Audit"]
        D4["👤 Dev 4: Leaves & Payroll<br/>• PTO/Sick Balances<br/>• 1-Click Approval Matrix<br/>• Payslip Calculations"]
    end
```

---

## 🚀 Core Modules & Features

### 🔐 1. Authentication & Role-Based Access Control (RBAC)
- **Login Credentials**: Standard login via Company Login ID (e.g. `DAYFLOWMASTER01`, `OIJODO20260002`) or Email.
- **Strict Role-Gating**: `ADMIN` / `HR` users access administrative consoles; `EMPLOYEE` users are restricted to their own profiles, punch sessions, and balances.
- **Password Security**: Passwords hashed with `bcryptjs` (salt rounds: 10). Session tokens stored in HTTP-only `jose` encrypted JWT cookies.

### 👥 2. Employee Profile & Admin Directory (`/employees`, `/profile`)
- **Searchable Team Directory**: Instant search across names, job titles, and departments.
- **Statutory HR Fields**: Dedicated tabs for PAN Number, 12-digit UAN, Bank Account, Salary, Phone, and Residential Address.
- **Live Creation**: Admin route (`/dashboard/employees/create`) auto-generates Login IDs and initial passwords.

### ⏱️ 3. Attendance Tracking & Real-Time Clock Engine (`/attendance`)
- **Live Stopwatch Work Timer**: Real-time counter ticking since check-in with dynamic pulse state badges (`Working Now`, `On Break`, `Clocked Out`).
- **Location Tagging**: Toggle between *HQ Office* and *Remote Work from Home*.
- **Interactive Visualizations**:
  - Daily step-progression timeline (Punch in, Lunch break, Punch out, Remarks).
  - Weekly timesheet bars against the standard 8-hour target.
  - Monthly attendance calendar (🟢 Present, 🟡 Half-Day, 🔴 Absent, 🔵 Leave).
- **Admin Audit Table & Regularization**: Searchable company registry with 1-click CSV export and manual timing adjustment modals.

### 🌴 4. Leave Approvals & Payroll Engine (`/time-off`, `/payroll`)
- **Leave Balance Cards**: Live trackers for Paid Time Off (24 days) and Sick Time Off (7 days).
- **Approval Matrix**: HR Admins can review pending leave applications and approve/reject with audit remarks.
- **Salary Computation & Payslips**: Reactive breakdown of Base Wage, HRA (50%), Standard Allowance, PF Deductions (12%), Professional Tax, and Net Take-Home Pay with printable payslip format.

---

## 🔑 Judge & Evaluator Quick Test Credentials

All 6 accounts are pre-seeded in the database with passwords verified:

| Role | Persona Name | Login ID | Email | Password | Primary Demo Feature |
|:---|:---|:---|:---|:---|:---|
| **ADMIN** | **Master Admin** | `DAYFLOWMASTER01` | `admin@dayflow.com` | `AdminPassword123!` | Full Admin Console & Metrics |
| **ADMIN** (HR) | **Emily Zhang** | `OIEMZH20260001` | `emily.hr@dayflow.com` | `Employee123!` | Leave Approvals & Regularization |
| **EMPLOYEE** | **John Doe** | `OIJODO20260002` | `john@dayflow.com` | `Employee123!` | Live Clock Widget & Attendance |
| **EMPLOYEE** | **Sarah Jenkins** | `OISJEN20260003` | `sarah@dayflow.com` | `Employee123!` | Profile Statutory PAN/UAN |
| **EMPLOYEE** | **Alex Rivera** | `OIARIV20260004` | `alex@dayflow.com` | `Employee123!` | Pending 3-Day Leave Request |
| **EMPLOYEE** | **Priya Sharma** | `OIPSHA20260005` | `priya@dayflow.com` | `Employee123!` | Half-day punch & Timesheet |

---

## ⚙️ Architecture & Code Quality Standards

Our codebase is structured with strict separation of concerns for enterprise scale:
- **Server Actions & Route Handlers**: Type-safe business operations under `src/app/actions` and `src/app/api`.
- **Modular Component Hierarchies**: Reusable component domains partitioned into `/attendance`, `/leave`, `/payroll`, and `/profile`.
- **Strict TypeScript & ESLint**: Fully type-checked across 24 routes with zero compiler warnings or lint errors.
- **Automated Vercel Deployments**: Continuous zero-downtime deployment synchronized with Prisma client generation.

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x`
- **npm**: `v10.x` or higher

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ayushyadav0707/Odoo-2026.git
   cd Odoo-2026
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```

4. **Initialize & Seed the Database:**
   ```bash
   npx prisma db push --force-reset
   npx tsx prisma/seed.ts
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open **(https://employa-hrms.vercel.app/)** in your browser!

---

<div align="center">
Built with ❤️ for the <strong>Odoo Hackathon 2026</strong>
</div>
