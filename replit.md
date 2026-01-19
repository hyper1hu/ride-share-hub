# RideShare - Car Hire Application

## Overview
A React-based car hire/ride-sharing application where drivers can list their cars with routes (A to B) and fares, and customers can browse and book rides. Features two main sections - one for drivers and one for customers.

## Project Architecture

### Framework
- **React 18** with TypeScript
- **Express.js** backend server
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **UI Components**: Custom shadcn-style components with Radix primitives
- **Styling**: Tailwind CSS with dark/light theme support

### Directory Structure
```
├── client/
│   ├── index.html           # Web entry point
│   └── src/
│       ├── main.tsx         # React entry point
│       ├── App.tsx          # Routes and providers
│       ├── index.css        # Tailwind + theme CSS
│       ├── components/
│       │   ├── ui/          # Reusable UI components
│       │   ├── theme-toggle.tsx
│       │   ├── add-car-dialog.tsx
│       │   └── booking-dialog.tsx
│       ├── pages/
│       │   ├── home.tsx     # Landing page
│       │   ├── customer.tsx # Browse and book rides
│       │   └── driver.tsx   # List and manage cars
│       ├── hooks/
│       │   ├── use-theme.tsx
│       │   └── use-toast.ts
│       └── lib/
│           ├── queryClient.ts
│           └── utils.ts
├── server/
│   ├── index.ts             # Express server entry
│   ├── routes.ts            # API routes
│   └── storage.ts           # In-memory data storage
├── shared/
│   └── schema.ts            # Zod schemas and types
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.js
```

### API Routes
- `GET /api/cars` - List all cars
- `POST /api/cars` - Create a car listing
- `PATCH /api/cars/:id` - Update a car
- `DELETE /api/cars/:id` - Delete a car
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create a booking

### Page Routes
- `/` - Home page with role selection
- `/customer` - Browse available rides and book seats
- `/driver` - List cars and manage listings

### Data Models
- **Car**: Driver info, route (origin/destination), fares, timings, seats
- **Booking**: Customer info, car reference, seats booked, trip type, fare

## Features
- Light/dark theme toggle with localStorage persistence
- Responsive layout for web and mobile
- In-memory data storage
- Form validation with Zod
- Real-time fare calculation
- Search/filter rides by origin and destination

## Development Commands
- `npm run dev` - Start development server on port 5000

## Recent Changes (January 2026)
- Restored React application after accidental Flutter conversion attempt
- Fixed Vite configuration for external host access
- All core functionality tested and working
