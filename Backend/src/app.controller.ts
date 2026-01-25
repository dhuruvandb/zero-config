import { Controller, Get, Post, Param, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/health")
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
    try {
      await this.appService.generateSingleTemplate(template, res);
    } catch (err) {
      if (!res.headersSent) {
        res.status(400).json({
          error: 'Server error',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }
  }

  @Post('/templates')
  async generateCombinedTemplates(
    @Body() body: { templates: string[] },
    @Res() res: any,
  ): Promise<void> {
    try {
      await this.appService.generateCombinedTemplates(body.templates, res);
    } catch (err) {
      if (!res.headersSent) {
        res.status(400).json({
          error: 'Invalid request',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }
  }

  @Post('/generate-combined')
  async generateCombined(
    @Body() body: { templates: string[] },
    @Res() res: any,
  ): Promise<void> {
    try {
      await this.appService.generateCombinedTemplates(body.templates, res);
    } catch (err) {
      if (!res.headersSent) {
        res.status(400).json({
          error: 'Invalid request',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }
  }
}
