# RideShare - Vehicle Hire Application

## Overview
A React-based vehicle hire/ride-sharing application supporting multiple vehicle types (cars, buses, vans, motorcycles, etc.). Drivers can list vehicles with routes and fares, customers can browse and book rides. Features landmark-based location selection for easy navigation.

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
- **Car/Vehicle**: Vehicle type, driver info, route (origin/destination), fares, timings, seats (up to 60 for buses)
- **Booking**: Customer info, vehicle reference, seats booked, trip type, fare

### Vehicle Types Supported
- Car, SUV, Van, Bus, Minibus, Motorcycle, Auto Rickshaw, Truck

## Features
- **Multiple Vehicle Types**: 8 different vehicle types with appropriate icons
- **Landmark Location Selection**: 400+ West Bengal and Indian locations for easy selection
  - **Kolkata**: Howrah Station, Sealdah Station, Victoria Memorial, Dakshineswar, Kalighat, Science City, Park Street, Salt Lake, New Town, Gariahat, Behala, Jadavpur, Dumdum, Barasat
  - **North Bengal**: Darjeeling, Siliguri, NJP Station, Bagdogra Airport, Kalimpong, Kurseong, Mirik, Jalpaiguri, Cooch Behar, Alipurduar, Dooars, Jaldapara
  - **Beaches**: Digha, Mandarmani, Tajpur, Bakkhali, Diamond Harbour
  - **Central Bengal**: Durgapur, Asansol, Bardhaman, Bankura, Bishnupur, Purulia, Hooghly, Chandannagar
  - **Religious/Cultural**: Shantiniketan, Nabadwip, Mayapur, Murshidabad, Belur Math
  - **Other Districts**: Malda, Kharagpur, Haldia, Nadia, Birbhum
  - **Nearby States**: Patna (Bihar), Ranchi (Jharkhand), Bhubaneswar (Odisha), Guwahati (Assam)
- **Currency**: Indian Rupees (₹) for all fares
- Light/dark theme toggle with localStorage persistence
- Responsive layout for web and mobile
- In-memory data storage
- Form validation with Zod
- Real-time fare calculation
- Search/filter rides by origin, destination, and landmarks

## Development Commands
- `npm run dev` - Start development server on port 5000

## Recent Changes (January 2026)
- Added "Use Current Location" feature with GPS detection for smart pickup point suggestions
- Added smart search with aliases (type "airport" to find Kolkata Airport, "beach" for Digha, etc.)
- Added 441+ comprehensive West Bengal locations covering all 23 districts
- Changed currency from dollars ($) to Indian Rupees (₹)
- Added support for 8 vehicle types (car, SUV, van, bus, minibus, motorcycle, auto rickshaw, truck)
- Increased max seats to 60 for buses
- Updated UI with vehicle type badges and icons
- Flutter mobile app structure available in flutter_rideshare/ folder
- All core functionality tested and working
