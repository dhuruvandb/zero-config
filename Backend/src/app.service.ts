import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import fetch, { Response as FetchResponse } from 'node-fetch';
import unzipper from 'unzipper';
import archiver from 'archiver';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

interface TemplateFile {
  path: string;
  content: Buffer;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  // Security: Define allowed templates explicitly
  private readonly TEMPLATES = {
    react: 'react',
    angular: 'angular',
    vuejs: 'vuejs',
    nextjs: 'nextjs',
    express: 'express',
    nestjs: 'nestjs',
    fastify: 'fastify',
  };

  // Single source of truth: local path or GitHub zip URL
  // If not set, auto-detects sibling zero-config-templates folder
  private readonly TEMPLATES_PATH = process.env.TEMPLATES_PATH || '';

  // Security: Maximum file sizes and limits
  private readonly MAX_ZIP_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly MAX_EXTRACTED_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly FETCH_TIMEOUT = 30000; // 30 seconds
  private readonly MAX_TEMPLATES_PER_REQUEST = 5;

  private readonly PROVIDER_MAP: Record<string, string> = {
    postgresql: 'postgresql',
    mysql: 'mysql',
    mariadb: 'mysql',
    sqlserver: 'sqlserver',
    sqlite: 'sqlite',
    cockroachdb: 'cockroachdb',
    mongodb: 'mongodb',
  };

  async extractTemplateFolder(
    zipBuffer: Buffer,
    templateName: string,
  ): Promise<TemplateFile[]> {
    let totalExtractedSize = 0;

    try {
      // Security: Validate file size
      if (zipBuffer.length > this.MAX_ZIP_SIZE) {
        throw new BadRequestException('Template archive exceeds maximum size');
      }

      const directory = await unzipper.Open.buffer(zipBuffer);
      const repoPrefix = directory.files[0]?.path.split('/')[0] || '';
      const templatePath = `${repoPrefix}/${templateName}/`;

      const templateFiles = directory.files.filter((file) =>
        file.path.startsWith(templatePath),
      );

      if (templateFiles.length === 0) {
        throw new BadRequestException(`Template "${templateName}" not found`);
      }

      const files: TemplateFile[] = [];

      for (const file of templateFiles) {
        if (file.type === 'File') {
          const content = await file.buffer();

          // Security: Check extracted size
          totalExtractedSize += content.length;
          if (totalExtractedSize > this.MAX_EXTRACTED_SIZE) {
            throw new BadRequestException('Total extracted size exceeds maximum');
          }

          const relativePath = file.path.replace(templatePath, '');

          // Security: Prevent path traversal
          if (relativePath.includes('..') || relativePath.startsWith('/')) {
            this.logger.warn(`Potential path traversal attempt: ${relativePath}`);
            continue;
          }

          files.push({ path: relativePath, content });
        }
      }

      return files;
    } catch (err) {
      this.logger.error(`Error extracting template: ${templateName}`, err);
      throw err;
    }
  }

  getAvailableTemplates() {
    return {
      templates: Object.keys(this.TEMPLATES),
    };
  }

  private resolveTemplateSource(): { type: 'url' | 'local'; path: string } {
    const envPath = this.TEMPLATES_PATH;

    if (envPath) {
      return {
        type: envPath.startsWith('http://') || envPath.startsWith('https://') ? 'url' : 'local',
        path: envPath,
      };
    }

    // Auto-detect sibling zero-config-templates folder
    const siblingPath = path.resolve(process.cwd(), '..', '..', 'zero-config-templates');
    if (fs.existsSync(siblingPath)) {
      this.logger.log(`Auto-detected templates at: ${siblingPath}`);
      return { type: 'local', path: siblingPath };
    }

    throw new InternalServerErrorException(
      'TEMPLATES_PATH not set and zero-config-templates not found. ' +
      'Set TEMPLATES_PATH in .env to a local path or a GitHub zip URL.',
    );
  }

  async generateSingleTemplate(template: string, res: Response): Promise<void> {
    // Security: Whitelist check
    if (!this.TEMPLATES[template as keyof typeof this.TEMPLATES]) {
      throw new BadRequestException({
        error: 'Invalid template',
        available: Object.keys(this.TEMPLATES),
      });
    }

    let files: TemplateFile[] | null = null;
    let archive: archiver.Archiver | null = null;

    try {
      const source = this.resolveTemplateSource();

      if (source.type === 'local') {
        files = this.readLocalTemplateFolder(template, source.path);
      } else {
        const response = await this.fetchWithTimeout(source.path);
        if (!response.ok) {
          throw new InternalServerErrorException(
            'Failed to fetch template from ' + source.path,
          );
        }
        const zipBuffer = await response.buffer();
        files = await this.extractTemplateFolder(zipBuffer, template);
        // zipBuffer goes out of scope here — ready for GC
      }

      archive = archiver('zip', { zlib: { level: 9 } });

      // Security: Set secure headers
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${template}-template.zip"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');

      archive.pipe(res);
      for (const file of files) {
        archive.append(file.content, { name: file.path });
      }
      await archive.finalize();
    } catch (err) {
      this.logger.error(`Error generating single template: ${template}`, err);
      throw err;
    } finally {
      // Cleanup: release memory
      if (files) {
        files.forEach(f => (f.content = Buffer.alloc(0)));
        files.length = 0;
      }
      if (archive) {
        archive.abort();
      }
    }
  }

  private readLocalTemplateFolder(templateName: string, basePath?: string): TemplateFile[] {
    const templateDir = path.join(basePath || this.TEMPLATES_PATH, templateName);
    const files: TemplateFile[] = [];

    const walkDir = (dir: string, relativePrefix: string = '') => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          walkDir(fullPath, relPath);
        } else if (entry.isFile()) {
          files.push({ path: relPath, content: fs.readFileSync(fullPath) });
        }
      }
    };

    if (!fs.existsSync(templateDir)) {
      throw new BadRequestException(`Template "${templateName}" not found locally`);
    }

    walkDir(templateDir);
    return files;
  }

  private replacePrismaProvider(
    files: TemplateFile[],
    database: string | undefined,
  ): void {
    if (!database) return;

    const provider = this.PROVIDER_MAP[database];
    if (!provider) {
      this.logger.warn(`Unknown database "${database}", skipping provider replacement`);
      return;
    }

    for (const file of files) {
      if (file.path.endsWith('prisma/schema.prisma')) {
        const content = file.content.toString('utf-8');
        // Target only the datasource db block's provider, not the generator's
        const updated = content.replace(
          /(datasource db\s*\{[\s\S]*?provider\s*=\s*")[a-z0-9\-_]+(")/,
          `$1${provider}$2`,
        );
        if (updated !== content) {
          file.content = Buffer.from(updated, 'utf-8');
          this.logger.log(`Replaced Prisma provider to "${provider}" in ${file.path}`);
        }
      }
    }
  }

  async generateCombinedTemplates(
    templates: string[],
    res: Response,
    database?: string,
  ): Promise<void> {
    // Security: Validate input
    if (!Array.isArray(templates) || templates.length === 0) {
      throw new BadRequestException({
        error: 'Invalid request',
        message: 'Provide an array of template names in the body',
      });
    }

    // Security: Limit number of templates per request
    if (templates.length > this.MAX_TEMPLATES_PER_REQUEST) {
      throw new BadRequestException({
        error: 'Too many templates',
        message: `Maximum ${this.MAX_TEMPLATES_PER_REQUEST} templates allowed per request`,
      });
    }

    // Security: Validate each template
    for (const template of templates) {
      if (!this.TEMPLATES[template as keyof typeof this.TEMPLATES]) {
        throw new BadRequestException({
          error: 'Invalid template',
          message: `Template "${template}" not found`,
          available: Object.keys(this.TEMPLATES),
        });
      }
    }

    const allFiles: TemplateFile[] = [];
    let archive: archiver.Archiver | null = null;

    try {
      const source = this.resolveTemplateSource();

      if (source.type === 'local') {
        for (const template of templates) {
          const files = this.readLocalTemplateFolder(template, source.path);
          this.replacePrismaProvider(files, database);
          for (const file of files) {
            allFiles.push({ path: `${template}/${file.path}`, content: file.content });
          }
          // Allow GC to reclaim the intermediate array
          (files as TemplateFile[]).length = 0;
        }
      } else {
        const response = await this.fetchWithTimeout(source.path);
        if (!response.ok) {
          throw new InternalServerErrorException(
            'Failed to fetch templates from ' + source.path,
          );
        }

        const zipBuffer = await response.buffer();

        for (const template of templates) {
          const files = await this.extractTemplateFolder(zipBuffer, template);
          this.replacePrismaProvider(files, database);
          for (const file of files) {
            allFiles.push({ path: `${template}/${file.path}`, content: file.content });
          }
          // Allow GC to reclaim the intermediate array
          (files as TemplateFile[]).length = 0;
        }
        // zipBuffer goes out of scope here — ready for GC
      }

      archive = archiver('zip', { zlib: { level: 9 } });

      const filename =
        templates.length === 1
          ? `${templates[0]}-template.zip`
          : `${templates.join('-')}-stack.zip`;

      // Security: Set secure headers
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');

      archive.pipe(res);
      for (const file of allFiles) {
        archive.append(file.content, { name: file.path });
      }
      await archive.finalize();
    } catch (err) {
      this.logger.error('Error generating combined templates', err);
      throw err;
    } finally {
      // Cleanup: release memory
      for (const f of allFiles) {
        f.content = Buffer.alloc(0);
      }
      allFiles.length = 0;
      if (archive) {
        archive.abort();
      }
    }
  }

  // Security: Fetch with timeout protection
  private fetchWithTimeout(url: string, timeout: number = this.FETCH_TIMEOUT): Promise<FetchResponse> {
    return Promise.race([
      fetch(url),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Fetch timeout')), timeout),
      ),
    ]) as Promise<FetchResponse>;
  }
}