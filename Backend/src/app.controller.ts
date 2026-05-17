import { Controller, Get, Post, Param, Body, Res, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTemplatesDto } from './dto/create-templates.dto';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/')
  getHealthStatus() {
    return { status: 'ok' };
  }

  @Get('/templates')
  getAvailableTemplates() {
    return this.appService.getAvailableTemplates();
  }

  @Get('/generate-template/:template')
  async generateSingleTemplate(
    @Param('template') template: string,
    @Res() res: any,
  ): Promise<void> {
    // Validate template parameter
    if (!template || typeof template !== 'string') {
      throw new BadRequestException('Invalid template parameter');
    }

    if (!/^[a-z0-9\-]+$/.test(template)) {
      throw new BadRequestException('Template name contains invalid characters');
    }

    try {
      await this.appService.generateSingleTemplate(template, res);
    } catch (err) {
      if (!res.headersSent) {
        const statusCode = err?.status || 500;
        res.status(statusCode).json({
          error: 'Failed to generate template',
        });
      }
    }
  }

  @Post('/templates')
  async generateCombinedTemplates(
    @Body() body: CreateTemplatesDto,
    @Res() res: any,
  ): Promise<void> {
    try {
      await this.appService.generateCombinedTemplates(body.templates, res, body.database);
    } catch (err) {
      if (!res.headersSent) {
        const statusCode = err?.status || 400;
        res.status(statusCode).json({
          error: 'Failed to generate templates',
        });
      }
    }
  }

  @Post('/generate-combined')
  async generateCombined(
    @Body() body: CreateTemplatesDto,
    @Res() res: any,
  ): Promise<void> {
    try {
      await this.appService.generateCombinedTemplates(body.templates, res, body.database);
    } catch (err) {
      if (!res.headersSent) {
        const statusCode = err?.status || 400;
        res.status(statusCode).json({
          error: 'Failed to generate templates',
        });
      }
    }
  }
}
