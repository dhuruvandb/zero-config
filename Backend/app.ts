import express, { Request, Response } from "express";
import fetch from "node-fetch";
import cors from "cors";
import rateLimit from "express-rate-limit";
import unzipper from "unzipper";
import archiver from "archiver";

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON body

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many requests, please try again later.",
});
app.use("/api/generate-template", limiter);

// Available templates
const TEMPLATES = {
  react: "react",
  angular: "angular",
  express: "express",
  nestjs: "nestjs",
};

/**
 * Extract a specific folder from a GitHub ZIP
 */
async function extractTemplateFolder(
  zipBuffer: Buffer,
  templateName: string
): Promise<{ path: string; content: Buffer }[]> {
  const directory = await unzipper.Open.buffer(zipBuffer);
  const repoPrefix = directory.files[0]?.path.split("/")[0] || "";
  const templatePath = `${repoPrefix}/${templateName}/`;

  const templateFiles = directory.files.filter((file) =>
    file.path.startsWith(templatePath)
  );

  if (templateFiles.length === 0) {
    throw new Error(`Template "${templateName}" not found`);
  }

  const files: { path: string; content: Buffer }[] = [];

  for (const file of templateFiles) {
    if (file.type === "File") {
      const content = await file.buffer();
      const relativePath = file.path.replace(templatePath, "");
      files.push({ path: relativePath, content });
    }
  }

  return files;
}

/**
 * NEW: Download single template
 */
app.get(
  "/api/generate-template/:template",
  async (req: Request, res: Response) => {
    try {
      const { template } = req.params;

      if (!TEMPLATES[template as keyof typeof TEMPLATES]) {
        return res.status(400).json({
          error: "Invalid template",
          available: Object.keys(TEMPLATES),
        });
      }

      const githubZipUrl =
        "https://github.com/dhuruvandb/zero-config-templates/archive/refs/heads/main.zip";

      const response = await fetch(githubZipUrl);
      if (!response.ok) {
        return res.status(500).send("Failed to fetch template from GitHub");
      }

      const zipBuffer = await response.buffer();
      const files = await extractTemplateFolder(zipBuffer, template);

      // Create ZIP
      const archive = archiver("zip", { zlib: { level: 9 } });
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${template}-template.zip`
      );

      archive.pipe(res);
      files.forEach(({ path, content }) => {
        archive.append(content, { name: path });
      });
      archive.finalize();
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Server error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }
);

/**
 * NEW: Download MULTIPLE templates combined
 * POST /api/generate-combined
 * Body: { "templates": ["react", "express"] }
 */
app.post("/api/generate-combined", async (req: Request, res: Response) => {
  try {
    const { templates } = req.body;

    // Validate input
    if (!Array.isArray(templates) || templates.length === 0) {
      return res.status(400).json({
        error: "Invalid request",
        message: "Provide an array of template names in the body",
      });
    }

    // Validate each template exists
    for (const template of templates) {
      if (!TEMPLATES[template as keyof typeof TEMPLATES]) {
        return res.status(400).json({
          error: "Invalid template",
          message: `Template "${template}" not found`,
          available: Object.keys(TEMPLATES),
        });
      }
    }

    const githubZipUrl =
      "https://github.com/dhuruvandb/zero-config-templates/archive/refs/heads/main.zip";

    const response = await fetch(githubZipUrl);
    if (!response.ok) {
      return res.status(500).send("Failed to fetch template from GitHub");
    }

    const zipBuffer = await response.buffer();

    // Extract all requested templates
    const allFiles: { path: string; content: Buffer }[] = [];

    for (const template of templates) {
      const files = await extractTemplateFolder(zipBuffer, template);

      // Add folder prefix to avoid conflicts
      // e.g., "package. json" becomes "react/package.json"
      files.forEach(({ path, content }) => {
        allFiles.push({
          path: `${template}/${path}`,
          content,
        });
      });
    }

    // Create combined ZIP
    const archive = archiver("zip", { zlib: { level: 9 } });
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=combined-templates. zip`
    );

    archive.pipe(res);
    allFiles.forEach(({ path, content }) => {
      archive.append(content, { name: path });
    });
    archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

/**
 * POST /api/templates - Download selected template combination
 * Body: { "templates": ["react", "express"] }
 */
app.post("/api/templates", async (req: Request, res: Response) => {
  try {
    const { templates } = req.body;

    // Validate input
    if (!Array.isArray(templates) || templates.length === 0) {
      return res.status(400).json({
        error: "Invalid request",
        message: "Provide an array of template names in the body",
      });
    }

    // Validate each template exists
    for (const template of templates) {
      if (!TEMPLATES[template as keyof typeof TEMPLATES]) {
        return res.status(400).json({
          error: "Invalid template",
          message: `Template "${template}" not found`,
          available: Object.keys(TEMPLATES),
        });
      }
    }

    const githubZipUrl =
      "https://github.com/dhuruvandb/zero-config-templates/archive/refs/heads/main.zip";

    const response = await fetch(githubZipUrl);
    if (!response.ok) {
      return res.status(500).json({
        error: "Failed to fetch templates from GitHub",
      });
    }

    const zipBuffer = await response.buffer();

    // Extract all requested templates
    const allFiles: { path: string; content: Buffer }[] = [];

    for (const template of templates) {
      const files = await extractTemplateFolder(zipBuffer, template);

      // Add folder prefix to keep templates organized
      files.forEach(({ path, content }) => {
        allFiles.push({
          path: `${template}/${path}`,
          content,
        });
      });
    }

    // Create combined ZIP
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Set appropriate filename based on templates
    const filename =
      templates.length === 1
        ? `${templates[0]}-template.zip`
        : `${templates.join("-")}-stack.zip`;

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("X-Content-Type-Options", "nosniff");

    archive.pipe(res);
    allFiles.forEach(({ path, content }) => {
      archive.append(content, { name: path });
    });
    archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

/**
 * Get list of available templates
 */
app.get("/api/templates", (_req: Request, res: Response) => {
  res.json({
    templates: Object.keys(TEMPLATES),
  });
});

app.listen(8000, () => console.log("Server running on http://localhost:8000"));
