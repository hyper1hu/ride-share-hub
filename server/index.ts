import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
          "@": path.resolve(__dirname, "../client/src"),
          "@shared": path.resolve(__dirname, "../shared"),
        },
      },
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "../dist/public")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../dist/public/index.html"));
    });
  }

  const port = 5000;
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`${new Date().toLocaleTimeString()} [express] serving on port ${port}`);
  });
})();
