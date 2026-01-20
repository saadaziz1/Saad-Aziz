# POS - Premium POS & Inventory Management System

A state-of-the-art POS and Inventory Management System built with a focus on premium aesthetics, robust validation, and seamless user experience.

## 🚀 Overview

POS is a full-stack monorepo application designed for modern cafes and restaurants. It combines a highly responsive Point of Sale (POS) interface with deep inventory management, featuring real-time stock tracking and automated low-stock warnings.

## 📁 Project Structure

The project is organized into two primary components:

### 🖥️ Client (Frontend) - `/client`
Built with **Next.js**, **Tailwind CSS**, and **Shadcn UI**.
- `app/`: Modern App Router structure for routing and layouts.
- `components/`: Modular component architecture (Atoms, Molecules, Organisms).
- `libreduxservices/`: Centralized state management using **Redux Toolkit (RTK) Query** for efficient API interactions.
- `hooks/`: Custom hooks for POS logic, dashboard analytics, and UI state.
- `styles/`: Global CSS and design tokens for the glassmorphic theme.

### ⚙️ Server (Backend) - `/server`
Built with **NestJS** and **Mongoose**.
- `src/modules/`: Domain-driven modules (Products, Raw Materials, Categories, Orders, Auth).
- `src/dto/`: Strict data transfer objects with character and numeric validation.
- `src/schema/`: Mongoose schemas for MongoDB data persistence.

## ✨ Features & Functionality

### 🛒 Point of Sale (POS)
- **Dynamic Category Navigation**: Scrollable category tabs with real-time product filtering.
- **Advanced Cart System**: Add products, adjust quantities, and attach custom notes to specific items.
- **Smart Payment Dialog**: Support for multiple payment methods and detailed order confirmation.
- **Availability Tracking**: Real-time indication of product stock levels based on raw material availability.

### 📦 Inventory & Product Management
- **Recipe-Based BOM (Bill of Materials)**: Define products by their constituent raw materials.
- **Premium Raw Material Cards**: Glassmorphic UI with dynamic stock bars, safety indicators, and status badges.
- **Dependency Tracking**: Intelligence system that warns users if deactivating a material will affect existing products.
- **Low Stock Alerts**: Configurable thresholds for materials with visual alerts when stock is critical.

### 🛡️ Robust Validation
- **Strict Character Limits**: 
  - Product Names: 25 characters
  - Category Names: 10 characters
  - Raw Material Names: 25 characters
- **Numeric Safeguards**: 
  - Max Price: 9,999,999,999
  - Negative Value Protection on all fields.
  - Digit slicing on input to prevent database overflow.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons, Shadcn UI, Framer Motion.
- **Backend**: NestJS, TypeScript, MongoDB (via Mongoose), Class-Validator.
- **State Management**: Redux Toolkit (RTK) & RTK Query.

## 🗺️ Future Roadmap

### 👤 Advanced User & Role Management
- **Role-Based Access Control (RBAC)**: Implementation of Admin, Manager, and Staff roles.
- **Permission Matrix**: Detailed control over who can modify inventory, view sales reports, or manage categories.
- **User Activity Audit**: Log system to track modifications to inventory and product settings.

### 📊 Analytics & Reporting
- **Revenue Dashboard**: Visualizations of daily, weekly, and monthly sales.
- **Usage Reports**: Analytics on raw material consumption patterns.

### 🔌 Integrations
- **Supplier Portal**: Direct ordering system for raw materials from approved vendors.
- **Cloud Printing**: Automated receipt printing for order confirmation.

## 🛠️ Getting Started

1.  **Clone the Repository**
2.  **Environment Setup**: Configure `.env` files in both `/client` and `/server`.
3.  **Install Dependencies**: Run `npm install` in both directories.
4.  **Run Development**:
    - Backend: `cd server && npm run start:dev`
    - Frontend: `cd client && npm run dev`

---
Copyright © 2026 POS Team. All Rights Reserved.
