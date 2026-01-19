import express from "express";
import session from "express-session";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET || "rideshare-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
  },
}));

const httpServer = createServer(app);

(async () => {
  await registerRoutes(httpServer, app);

  if (process.env.NODE_ENV === "development") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: "spa",
      root: "client",
      resolve: {
        alias: {
          "@": path.resolve(process.cwd(), "client/src"),
          "@shared": path.resolve(process.cwd(), "shared"),
        },
      },
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist/public");
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const port = 5000;
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`${new Date().toLocaleTimeString()} [express] serving on port ${port}`);
  });
})();
