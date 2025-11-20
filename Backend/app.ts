import express, { Request, Response } from "express";
import fetch from "node-fetch"; // or native fetch in Node 18+
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many requests, please try again later.",
});
app.use("/api/generate-mern-starter", limiter);

app.get("/api/generate-mern-starter", async (_req: Request, res: Response) => {
  try {
    const githubZipUrl =
      "https://github.com/dhuruvandb/zero-config-templates/archive/refs/heads/main.zip";

    // Fetch the ZIP from GitHub
    const response = await fetch(githubZipUrl);

    if (!response.ok) {
      return res.status(500).send("Failed to fetch template from GitHub");
    }

    // Set headers for the client
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=zero-config-templates.zip"
    );

    // Stream directly to client
    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(8000, () => console.log("Server running on http://localhost:8000"));
