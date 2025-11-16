import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import os from "os";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { spawn } from "child_process";
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
const PORT = 8000;

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many requests, please try again later.",
});
app.use("/api/generate-mern-starter", limiter);

const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
  console.log("Client connected for progress updates");
});

// Helper to broadcast progress to all connected clients
function broadcastProgress(percent: number, text?: string) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ progress: percent, text }));
    }
  });
}

/** ----------------------------------------------
 *  Helper → Run "npx create-vite" non-interactively
 * ---------------------------------------------- */
function createViteReactProject(tempDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "npx",
      ["create-vite@latest", "client", "--template", "react-ts"],
      {
        cwd: tempDir,
        stdio: "pipe",
        shell: true,
      }
    );

    child.stdout.on("data", (data) => {
      const text = data.toString();
      console.log("Vite:", text);

      if (text.includes("Use rolldown-vite")) {
        child.stdin.write("n\n");
      }

      if (text.includes("Install with npm and start now?")) {
        child.stdin.write("n\n");
      }
    });

    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error("create-vite failed with code " + code));
    });
  });
}

/** ----------------------------------------------
 *  Your custom App.tsx to replace Vite’s default
 * ---------------------------------------------- */
const customAppTsx = `import React, { useEffect, useState } from "react";

interface Item {
  _id?: string;
  name: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<string>("");

  const API_URL = \`
http://localhost:5000/api/items
\`;

  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL.trim());
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

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
            <button
              onClick={() => item._id && deleteItem(item._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {items.length === 0 && <p>No items yet. Add one above!</p>}
    </div>
  );
}

export default App;
`;

/** ----------------------------------------------
 *  MAIN ROUTE — Generate MERN project
 * ---------------------------------------------- */
app.get("/api/generate-mern-starter", async (req: Request, res: Response) => {
  const tempDir = path.join(os.tmpdir(), `mern-starter-${Date.now()}`);

  try {
    fs.mkdirSync(tempDir, { recursive: true });

    // ------------------------------------
    // 1. Generate frontend using Vite
    // ------------------------------------
    console.log("Generating Vite frontend...");
    broadcastProgress(5, "Generating Vite frontend...");
    await createViteReactProject(tempDir);
    broadcastProgress(20, "Frontend generated");

    // Replace Vite's App.tsx with your custom App.tsx
    fs.writeFileSync(path.join(tempDir, "client/src/App.tsx"), customAppTsx);
    broadcastProgress(30, "Replaced App.tsx");

    // ------------------------------------
    // 2. Generate backend
    // ------------------------------------
    console.log("Generating backend...");
    broadcastProgress(40, "Generating backend...");

    const serverDir = path.join(tempDir, "server");
    fs.mkdirSync(serverDir, { recursive: true });
    fs.mkdirSync(path.join(serverDir, "src"), { recursive: true });

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
    broadcastProgress(50, "Created server package.json");

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
    broadcastProgress(55, "Created tsconfig.json for server");

    const indexTs = `
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from "dotenv";
dotenv.config();

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

    fs.writeFileSync(path.join(serverDir, "src/index.ts"), indexTs);
    fs.writeFileSync(path.join(serverDir, ".env"), `MONGO_URI=\nPORT=5000\n`);
    broadcastProgress(65, "Backend files created");

    // Setup README
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
    broadcastProgress(70, "README.md created");

    // ------------------------------------
    // 4. ZIP and send
    // ------------------------------------
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=mern-starter.zip"
    );

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    archive.on("progress", (progress) => {
      const percent = Math.round(
        (progress.entries.processed / progress.entries.total) * 100
      );
      broadcastProgress(percent, "Zipping project...");
    });

    archive.on("error", (err) => {
      console.error("Archive error:", err);
      res.status(500).send("Internal Server Error");
    });

    archive.on("finish", () => {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
        broadcastProgress(100, "Done! Download started");
        console.log("Temp directory cleaned up:", tempDir);
      } catch (err) {
        console.error("Failed to delete temp dir:", err);
      }
    });

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
