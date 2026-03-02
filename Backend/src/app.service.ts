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
    springboot: 'springboot',
  };

  private readonly GITHUB_ZIP_URL =
    'https://github.com/dhuruvandb/zero-config-templates/archive/refs/heads/main.zip';

  // Security: Maximum file sizes and limits
  private readonly MAX_ZIP_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly MAX_EXTRACTED_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly FETCH_TIMEOUT = 30000; // 30 seconds
  private readonly MAX_TEMPLATES_PER_REQUEST = 5;

  private totalExtractedSize = 0;

  async extractTemplateFolder(
    zipBuffer: Buffer,
    templateName: string,
  ): Promise<TemplateFile[]> {
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
          this.totalExtractedSize += content.length;
          if (this.totalExtractedSize > this.MAX_EXTRACTED_SIZE) {
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

  async generateSingleTemplate(template: string, res: Response): Promise<void> {
    try {
      // Security: Whitelist check
      if (!this.TEMPLATES[template as keyof typeof this.TEMPLATES]) {
        throw new BadRequestException({
          error: 'Invalid template',
          available: Object.keys(this.TEMPLATES),
        });
      }

      this.totalExtractedSize = 0; // Reset for new request

      const response = await this.fetchWithTimeout(this.GITHUB_ZIP_URL);
      if (!response.ok) {
        throw new InternalServerErrorException(
          'Failed to fetch template from GitHub',
        );
      }

      const zipBuffer = await response.buffer();
      const files = await this.extractTemplateFolder(zipBuffer, template);

      const archive = archiver('zip', { zlib: { level: 9 } });
      
      // Security: Set secure headers
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${template}-template.zip"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');

      archive.pipe(res);
      files.forEach(({ path, content }) => {
        archive.append(content, { name: path });
      });
      await archive.finalize();
    } catch (err) {
      this.logger.error(`Error generating single template: ${template}`, err);
      throw err;
    }
  }

  async generateCombinedTemplates(
    templates: string[],
    res: Response,
  ): Promise<void> {
    try {
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

      this.totalExtractedSize = 0; // Reset for new request

      const response = await this.fetchWithTimeout(this.GITHUB_ZIP_URL);
      if (!response.ok) {
        throw new InternalServerErrorException(
          'Failed to fetch templates from GitHub',
        );
      }

      const zipBuffer = await response.buffer();
      const allFiles: TemplateFile[] = [];

      for (const template of templates) {
        const files = await this.extractTemplateFolder(zipBuffer, template);
        files.forEach(({ path, content }) => {
          allFiles.push({
            path: `${template}/${path}`,
            content,
          });
        });
      }

      const archive = archiver('zip', { zlib: { level: 9 } });

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
      allFiles.forEach(({ path, content }) => {
        archive.append(content, { name: path });
      });
      await archive.finalize();
    } catch (err) {
      this.logger.error('Error generating combined templates', err);
      throw err;
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

