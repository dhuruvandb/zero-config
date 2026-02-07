import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import fetch from 'node-fetch';
import unzipper from 'unzipper';
import archiver from 'archiver';
import { Response } from 'express';

interface TemplateFile {
  path: string;
  content: Buffer;
}

@Injectable()
export class AppService {
  private readonly TEMPLATES = {
    react: 'react',
    angular: 'angular',
    vue: 'vue',
    nextjs: 'nextjs',
    express: 'express',
    nestjs: 'nestjs',
    springboot: 'springboot',
  };

  private readonly GITHUB_ZIP_URL =
    'https://github.com/dhuruvandb/zero-config-templates/archive/refs/heads/main.zip';

  async extractTemplateFolder(
    zipBuffer: Buffer,
    templateName: string,
  ): Promise<TemplateFile[]> {
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
        const relativePath = file.path.replace(templatePath, '');
        files.push({ path: relativePath, content });
      }
    }

    return files;
  }

  getAvailableTemplates() {
    return {
      templates: Object.keys(this.TEMPLATES),
    };
  }

  async generateSingleTemplate(template: string, res: Response): Promise<void> {
    if (!this.TEMPLATES[template as keyof typeof this.TEMPLATES]) {
      throw new BadRequestException({
        error: 'Invalid template',
        available: Object.keys(this.TEMPLATES),
      });
    }

    try {
      const response = await fetch(this.GITHUB_ZIP_URL);
      if (!response.ok) {
        throw new InternalServerErrorException(
          'Failed to fetch template from GitHub',
        );
      }

      const zipBuffer = await response.buffer();
      const files = await this.extractTemplateFolder(zipBuffer, template);

      const archive = archiver('zip', { zlib: { level: 9 } });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${template}-template.zip`,
      );

      archive.pipe(res);
      files.forEach(({ path, content }) => {
        archive.append(content, { name: path });
      });
      await archive.finalize();
    } catch (err) {
      throw new InternalServerErrorException({
        error: 'Server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  async generateCombinedTemplates(
    templates: string[],
    res: Response,
  ): Promise<void> {
    if (!Array.isArray(templates) || templates.length === 0) {
      throw new BadRequestException({
        error: 'Invalid request',
        message: 'Provide an array of template names in the body',
      });
    }

    for (const template of templates) {
      if (!this.TEMPLATES[template as keyof typeof this.TEMPLATES]) {
        throw new BadRequestException({
          error: 'Invalid template',
          message: `Template "${template}" not found`,
          available: Object.keys(this.TEMPLATES),
        });
      }
    }

    try {
      const response = await fetch(this.GITHUB_ZIP_URL);
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

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.setHeader('X-Content-Type-Options', 'nosniff');

      archive.pipe(res);
      allFiles.forEach(({ path, content }) => {
        archive.append(content, { name: path });
      });
      await archive.finalize();
    } catch (err) {
      throw new InternalServerErrorException({
        error: 'Server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }
}
