import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import os from "os";
import cors from "cors";
import rateLimit from "express-rate-limit";
// ----- 1. Load environment variables from .env -----
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = 8000;
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));

// ----- 3. Rate limiting to prevent DoS -----
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 requests per minute per IP
  message: "Too many requests, please try again later.",
});
app.use("/api/generate-mern-starter", limiter);

app.get("/api/generate-mern-starter", async (req: Request, res: Response) => {
  const tempDir = path.join(os.tmpdir(), `mern-starter-${Date.now()}`);
  try {
    // Create a temp directory

    fs.mkdirSync(tempDir, { recursive: true });

    // Create folder structure: client and server
    const clientDir = path.join(tempDir, "client");
    const serverDir = path.join(tempDir, "server");
    fs.mkdirSync(clientDir);
    fs.mkdirSync(serverDir);

    // Write full Vite React TS template files here

    // package.json
    const clientPackageJson = {
      name: "client",
      version: "0.0.0",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
      },
      devDependencies: {
        "@types/react": "^18.0.27",
        "@types/react-dom": "^18.0.10",
        typescript: "^5.1.3",
        vite: "^4.2.1",
        "@vitejs/plugin-react": "^3.1.0",
      },
    };
    fs.writeFileSync(
      path.join(clientDir, "package.json"),
      JSON.stringify(clientPackageJson, null, 2)
    );

    // vite.config.ts
    const viteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`;
    fs.writeFileSync(path.join(clientDir, "vite.config.ts"), viteConfig);

    // tsconfig.json
    const tsconfigClient = {
      compilerOptions: {
        target: "ESNext",
        useDefineForClassFields: true,
        lib: ["DOM", "DOM.Iterable", "ESNext"],
        allowJs: false,
        skipLibCheck: true,
        esModuleInterop: false,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: "ESNext",
        moduleResolution: "Node",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
      },
      include: ["src"],
      references: [{ path: "./tsconfig.node.json" }],
    };
    fs.writeFileSync(
      path.join(clientDir, "tsconfig.json"),
      JSON.stringify(tsconfigClient, null, 2)
    );

    // tsconfig.node.json
    const tsconfigNode = {
      compilerOptions: {
        composite: true,
        module: "NodeNext",
        moduleResolution: "Node",
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        skipLibCheck: true,
        types: ["node"],
      },
      include: ["vite.config.ts"],
    };
    fs.writeFileSync(
      path.join(clientDir, "tsconfig.node.json"),
      JSON.stringify(tsconfigNode, null, 2)
    );

    // index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
    fs.writeFileSync(path.join(clientDir, "index.html"), indexHtml);

    // src/main.tsx
    const srcDir = path.join(clientDir, "src");
    fs.mkdirSync(srcDir);
    const mainTsx = `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
    fs.writeFileSync(path.join(srcDir, "main.tsx"), mainTsx);

    // src/App.tsx
    const appTsx = `import React, { useEffect, useState } from "react";

interface Item {
  _id?: string;
  name: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<string>("");

  // API_URL declaration in Markdown-style code block
  const API_URL = \`
http://localhost:5000/api/items
\`;

  // Fetch all items
  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL.trim());
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  // Add a new item
  const addItem = async () => {
    if (!newItem.trim()) return;
    try {
      const res = await fetch(API_URL.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItem }),
      });
      const created = await res.json();
      setItems([...items, created]);
      setNewItem("");
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  // Delete an item
  const deleteItem = async (id: string) => {
    try {
      await fetch(\`\${API_URL.trim()}/\${id}\`, { method: "DELETE" });
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>MERN Starter CRUD Example</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="New item name"
        />
        <button onClick={addItem} style={{ marginLeft: "0.5rem" }}>
          Add
        </button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item._id} style={{ marginBottom: "0.5rem" }}>
            {item.name}{" "}
            <button onClick={() => item._id && deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {items.length === 0 && <p>No items yet. Add one above!</p>}
    </div>
  );
}

export default App;`;
    fs.writeFileSync(path.join(srcDir, "App.tsx"), appTsx);

    // -- Your existing backend creation code remains unchanged and follows here --

    // Backend package.json with Express + TS + Mongoose + in-memory MongoDB
    const serverPackageJson = {
      name: "server",
      version: "1.0.0",
      scripts: {
        dev: "ts-node-dev --respawn --transpile-only src/index.ts",
      },
      dependencies: {
        express: "^4.18.2",
        mongoose: "^7.0.0",
        "mongodb-memory-server": "^8.11.1",
        cors: "^2.8.5",
        dotenv: "^16.0.0",
      },
      devDependencies: {
        typescript: "^5.0.0",
        "@types/express": "^4.17.17",
        "ts-node-dev": "^2.0.0",
      },
    };
    fs.writeFileSync(
      path.join(serverDir, "package.json"),
      JSON.stringify(serverPackageJson, null, 2)
    );

    // Backend tsconfig.json
    const tsconfigServer = {
      compilerOptions: {
        target: "ES2020",
        module: "CommonJS",
        outDir: "dist",
        rootDir: "src",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
      },
    };
    fs.writeFileSync(
      path.join(serverDir, "tsconfig.json"),
      JSON.stringify(tsconfigServer, null, 2)
    );

    // Backend source index.ts
    const backendSrc = path.join(serverDir, "src");
    fs.mkdirSync(backendSrc);

    const indexTs = `
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const itemSchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model('Item', itemSchema);

async function connectDB() {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB URI');
      return;
    } catch (e) {
      console.error('Failed to connect to MONGO_URI, falling back to in-memory DB.');
    }
  }
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log('Connected to in-memory MongoDB');
}

connectDB();

app.get('/api/items', async (_req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/api/items', async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.json(item);
});

app.delete('/api/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on \${PORT}\`));
`;

    fs.writeFileSync(path.join(backendSrc, "index.ts"), indexTs);

    // .env file contents
    fs.writeFileSync(path.join(serverDir, ".env"), `MONGO_URI=\nPORT=5000\n`);

    // Setup run shell script
    const runScript = `# MERN Starter Template

This project is a boilerplate starter for building full-stack MERN applications with TypeScript support.

## Project Structure

mern-starter/
├── client/        # React + Vite frontend
├── server/        # Express + MongoDB backend
├── README.md      # This file
    

## Getting Started

These instructions will help you run the project locally.

### Prerequisites

*   Node.js (v14 or higher recommended)
*   npm (comes with Node.js)
*   MongoDB instance URI (optional; if not provided, an in-memory server will be used)

## Installation

Open two terminal windows or use your favorite terminal multiplexer.

### Backend

\`\`\`
cd server
npm install
\`\`\`

### Frontend

\`\`\`
cd client
npm install
\`\`\`

## Configuration: MongoDB Connection

The backend uses a MongoDB URI to connect to a real database.

1.  Create a \`.env\` file inside the \`server/\` folder.
2.  Add the following inside \`.env\`:

\`\`\`
MONGO_URI=your-mongodb-connection-string
PORT=5000
\`\`\`

If you do not provide a \`MONGO_URI\`, the backend will fallback to using an in-memory MongoDB server for rapid prototyping purposes.

## Running the project

Open two terminal windows/tabs:

### Start the backend server:

\`\`\`
cd server
npm run dev
\`\`\`

### Start the frontend server:

\`\`\`
cd client
npm run dev
\`\`\`

The frontend will be accessible at \`http://localhost:5173\`, and it communicates automatically with the backend at \`http://localhost:5000\`.`;

    fs.writeFileSync(path.join(tempDir, "README.md"), runScript);

    // Prepare the zip archive and stream it as the response
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=mern-starter.zip"
    );

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err: Error) => {
      console.error("Archive error:", err);
      res.status(500).send("Internal Server Error");
    });

    archive.on("end", () => {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log("Temp directory cleaned up:", tempDir);
      } catch (err) {
        console.error("Failed to delete temp dir:", err);
      }
      res.end();
    });

    archive.pipe(res);
    archive.directory(tempDir, false);

    await archive.finalize();
  } catch (error) {
    console.error("Error generating MERN starter:", error);
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Backend generator running on http://localhost:${PORT}`);
});
