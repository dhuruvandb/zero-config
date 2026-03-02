import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmetModule from 'helmet';
import rateLimitModule from 'express-rate-limit';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Security: Helmet for HTTP headers
  app.use(helmetModule());

  // Security: Rate limiting
  const limiter = rateLimitModule({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health check
      return req.path === '/api/';
    },
  });
  app.use(limiter);

  // Security: Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Security: CORS configuration
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
    maxAge: 3600,
  });

  const port = process.env.PORT || 8000;
  const env = process.env.NODE_ENV || 'development';

  await app.listen(port, '127.0.0.1');
  logger.log(`Application running on port ${port} in ${env} mode`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application', err);
  process.exit(1);
});

