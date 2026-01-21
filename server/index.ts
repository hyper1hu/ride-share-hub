import express from "express";
import session from "express-session";
import { createServer } from "http";
import { registerRoutes } from "./routes";

const app = express();

// Enable CORS for Flutter mobile app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session for mobile API
// Note: For production scale, consider Redis session store
app.use(session({
  secret: process.env.SESSION_SECRET || "rideshare-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for mobile app
    sameSite: "lax",
  },
}));

const httpServer = createServer(app);

(async () => {
  await registerRoutes(httpServer, app);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'RideShare API',
      version: '2.0.0'
    });
  });

  // Root endpoint for API info
  app.get('/', (req, res) => {
    res.json({
      name: 'RideShare Hub API',
      version: '2.0.0',
      description: 'Backend API for RideShare mobile application',
      endpoints: {
        health: '/health',
        auth: '/api/auth/*',
        cars: '/api/cars',
        drivers: '/api/drivers',
        bookings: '/api/bookings',
        customers: '/api/customers',
        stats: '/api/stats'
      },
      documentation: 'https://github.com/hyper1hu/ride-share-hub'
    });
  });

  // 404 handler for unknown routes
  app.use((req, res) => {
    res.status(404).json({ 
      error: 'Endpoint not found',
      path: req.path,
      method: req.method,
      message: 'Please check the API documentation'
    });
  });

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`${new Date().toLocaleTimeString()} [express] serving on port ${port}`);
    console.log(`[express] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[express] API ready for mobile app requests`);
  });
})();
