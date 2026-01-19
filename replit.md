# RideShare - Car Hire Application

## Overview
A car hire/ride-sharing application where drivers can list their cars with routes (A to B) and fares, and customers can browse and book rides. The app features two main sections - one for drivers and one for customers.

## Recent Changes
- Initial MVP implementation (Jan 2026)
  - Created schema for cars, bookings
  - Built home page with role selection
  - Built driver dashboard to list/manage cars
  - Built customer page to browse/book rides
  - Implemented in-memory storage backend

## Project Architecture

### Frontend (client/)
- **Framework**: React with TypeScript
- **Routing**: wouter
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS with shadcn/ui components
- **Theme**: Light/dark mode with ThemeProvider

### Pages
- `/` - Home page with role selection (Driver/Customer)
- `/customer` - Browse available rides and book seats
- `/driver` - List cars and manage listings

### Key Components
- `add-car-dialog.tsx` - Form for drivers to list new cars
- `booking-dialog.tsx` - Form for customers to book rides
- `theme-toggle.tsx` - Dark/light mode toggle

### Backend (server/)
- **Framework**: Express.js
- **Storage**: In-memory (MemStorage)
- **Validation**: Zod schemas

### API Endpoints
- `GET /api/cars` - List all cars
- `POST /api/cars` - Add new car listing
- `DELETE /api/cars/:id` - Remove car listing
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create new booking

### Data Models (shared/schema.ts)
- **Car**: Driver info, route (origin/destination), fares, timings, seats
- **Booking**: Customer info, car reference, seats booked, trip type, fare

## User Preferences
- Clean, modern UI with blue primary color
- Support for both light and dark themes
- Mobile-responsive design

## Development Commands
- `npm run dev` - Start development server
