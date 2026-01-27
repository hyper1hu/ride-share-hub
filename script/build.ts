import { build as viteBuild } from "vite";
import { build as esbuild } from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

async function buildClient() {
  console.log("Building client...");
  await viteBuild({
    root: path.join(rootDir, "client"),
    build: {
      outDir: path.join(rootDir, "dist/public"),
      emptyOutDir: true,
    },
  });
  console.log("✓ Client built successfully");
}

async function buildServer() {
  console.log("Building server...");
  await esbuild({
    entryPoints: [path.join(rootDir, "server/index.ts")],
    bundle: true,
    platform: "node",
    target: "node22",
    outfile: path.join(rootDir, "dist/index.cjs"),
    format: "cjs",
    external: [
      "express",
      "pg",
      "bcrypt",
      "firebase-admin",
      "drizzle-orm",
      "dotenv",
      "express-session",
      "connect-pg-simple",
      "memorystore",
    ],
    sourcemap: true,
    minify: false,
  });
  console.log("✓ Server built successfully");
}

async function main() {
  try {
    console.log("Starting build process...\n");
    
    await buildClient();
    await buildServer();
    
    console.log("\n✓ Build completed successfully!");
    console.log("\nOutput:");
    console.log("  - Client: dist/public/");
    console.log("  - Server: dist/index.cjs");
    console.log("\nRun 'npm start' to start the production server");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

main();
