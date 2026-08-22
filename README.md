# Dayflow - Human Resource Management System

*Every workday, perfectly aligned.*

Dayflow is a modern, full-stack Human Resource Management System (HRMS) designed to digitize and streamline core HR operations. Built with a focus on usability and role-based access, Dayflow simplifies employee onboarding, profile management, attendance tracking, leave management, and payroll visibility.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: SQLite (via `better-sqlite3`)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## ✨ Key Features

- **Role-Based Access Control**: Distinct views and permissions for Employees and Admins/HR Officers.
- **Smart Onboarding**: Automated generation of standardized Employee IDs (e.g., `OIJODO20220001`) and temporary passwords during HR registration.
- **Employee Directory & Profiles**: Comprehensive employee cards, detailed profile tabs (Private, Resume, Salary), and dynamic frontend salary component calculations.
- **Dynamic Dashboards**: 
  - *Employees*: Quick-access navigation cards and recent activity alerts.
  - *Admins*: High-level performance metrics, leave approvals, and quick-switch employee search.
- **Attendance & Time-Off** *(In Development)*: Daily/weekly attendance views, check-in/check-out systray, and leave request/approval workflows.



## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Odoo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   Ensure your `.env` file is configured with the correct database URL, then run:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📜 Database Schema Summary

The core data is driven by the `User` model, which handles both authentication and employee records. Key fields include:
- standard fields: `id`, `name`, `email`, `password`, `role` (Admin/Employee)
- Employee specific: `employeeId`, `phone`, `address`, `department`, `jobTitle`, `profilePicture`, `panNo`, `uanNo`, `dateOfJoining`, `dateOfBirth`
- Payroll specific: `basicSalary`

*(Additional models for Attendance and Leaves will be managed by Dev 3 & 4).*

---
*Built as part of a collaborative HRMS engineering project.*
