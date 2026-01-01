# 🛠️ Zero-Config - Implementation Guide for Improvements

This document provides **copy-paste ready code** for implementing the recommended improvements from the project analysis.

---

## 🚀 Quick Start Improvements (30 minutes)

### 1. Add Environment Variables Support

**Create `.env.example` in Backend directory:**

```bash
# Backend/.env.example
PORT=8000
NODE_ENV=development
GITHUB_REPO_URL=https://github.com/dhuruvandb/zero-config-templates/archive/refs/heads/main.zip
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=5
```

**Create `Backend/config.ts`:**

```typescript
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  githubRepoUrl: process.env.GITHUB_REPO_URL || 
    'https://github.com/dhuruvandb/zero-config-templates/archive/refs/heads/main.zip',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10),
  },
};

export default config;
```

**Update `Backend/app.ts` to use config:**

```typescript
import config from './config';

// Replace hardcoded values
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: "Too many requests, please try again later.",
});

// Replace all instances of the GitHub URL
const githubZipUrl = config.githubRepoUrl;

// Update the listen statement
app.listen(config.port, () => 
  console.log(`Server running on http://localhost:${config.port}`)
);
```

---

### 2. Enable TypeScript Strict Mode

**Update `Backend/tsconfig.json`:**

```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES2020",
    "outDir": "dist",
    "esModuleInterop": true,
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "skipLibCheck": true,
    "types": ["node"],
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

---

### 3. Add ESLint and Prettier

**Install dependencies:**

```bash
cd Backend
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier
```

**Create `Backend/.eslintrc.json`:**

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "error",
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_" 
    }]
  },
  "env": {
    "node": true,
    "es6": true
  }
}
```

**Create `Backend/.prettierrc`:**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Update `Backend/package.json` scripts:**

```json
{
  "scripts": {
    "build": "npm install && tsc",
    "start": "node dist/app.js",
    "dev": "nodemon ./app.ts",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write \"**/*.ts\"",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 🧪 Testing Implementation (1 hour)

### 1. Install Testing Dependencies

```bash
cd Backend
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

### 2. Create Jest Configuration

**Create `Backend/jest.config.js`:**

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### 3. Create Test Files

**Create `Backend/tests/api.test.ts`:**

```typescript
import request from 'supertest';
import express from 'express';
// Import your app (you'll need to export it from app.ts)

describe('Template API', () => {
  describe('GET /api/templates', () => {
    it('should return list of available templates', async () => {
      const response = await request(app).get('/api/templates');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('templates');
      expect(Array.isArray(response.body.templates)).toBe(true);
      expect(response.body.templates).toContain('react');
      expect(response.body.templates).toContain('express');
    });
  });

  describe('POST /api/templates', () => {
    it('should return 400 when no templates provided', async () => {
      const response = await request(app)
        .post('/api/templates')
        .send({ templates: [] });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid template name', async () => {
      const response = await request(app)
        .post('/api/templates')
        .send({ templates: ['invalid-template'] });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('not found');
    });

    it('should accept valid template names', async () => {
      const response = await request(app)
        .post('/api/templates')
        .send({ templates: ['react', 'express'] });
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/zip');
    });
  });

  describe('Rate Limiting', () => {
    it('should rate limit after max requests', async () => {
      // Make requests up to the limit
      for (let i = 0; i < 5; i++) {
        await request(app).get('/api/generate-template/react');
      }
      
      // Next request should be rate limited
      const response = await request(app).get('/api/generate-template/react');
      expect(response.status).toBe(429);
    });
  });
});
```

**Create `Backend/tests/extractTemplate.test.ts`:**

```typescript
import { extractTemplateFolder } from '../app';

describe('extractTemplateFolder', () => {
  it('should extract files from template folder', async () => {
    // Mock implementation
    const mockZipBuffer = Buffer.from('mock zip data');
    
    // This is a placeholder - you'd need actual test data
    // For real tests, create a small test ZIP file
    
    expect(true).toBe(true); // Placeholder
  });

  it('should throw error for non-existent template', async () => {
    const mockZipBuffer = Buffer.from('mock zip data');
    
    await expect(
      extractTemplateFolder(mockZipBuffer, 'non-existent')
    ).rejects.toThrow('Template "non-existent" not found');
  });
});
```

### 4. Update Package.json for Tests

**Add to `Backend/package.json`:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 5. Refactor app.ts to be testable

**At the end of `Backend/app.ts`, change:**

```typescript
// Before:
app.listen(8000, () => console.log("Server running on http://localhost:8000"));

// After:
export { app, extractTemplateFolder };

if (require.main === module) {
  app.listen(config.port, () => 
    console.log(`Server running on http://localhost:${config.port}`)
  );
}
```

---

## 🔒 Security Enhancements (30 minutes)

### 1. Add Security Headers

**Install Helmet:**

```bash
cd Backend
npm install helmet
```

**Add to `Backend/app.ts`:**

```typescript
import helmet from 'helmet';

// Add after creating the app
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
```

### 2. Add Request Size Limits

**Update `Backend/app.ts`:**

```typescript
// Replace:
app.use(express.json());

// With:
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
```

### 3. Add Input Validation

**Create `Backend/middleware/validation.ts`:**

```typescript
import { Request, Response, NextFunction } from 'express';

const VALID_TEMPLATE_REGEX = /^[a-z0-9-]+$/;

export function validateTemplates(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { templates } = req.body;

  if (!Array.isArray(templates)) {
    res.status(400).json({
      error: 'Invalid request',
      message: 'templates must be an array',
    });
    return;
  }

  if (templates.length === 0) {
    res.status(400).json({
      error: 'Invalid request',
      message: 'At least one template must be specified',
    });
    return;
  }

  if (templates.length > 10) {
    res.status(400).json({
      error: 'Invalid request',
      message: 'Maximum 10 templates allowed',
    });
    return;
  }

  for (const template of templates) {
    if (typeof template !== 'string' || !VALID_TEMPLATE_REGEX.test(template)) {
      res.status(400).json({
        error: 'Invalid template name',
        message: `Template name "${template}" contains invalid characters`,
      });
      return;
    }
  }

  next();
}
```

**Use in routes:**

```typescript
import { validateTemplates } from './middleware/validation';

app.post('/api/templates', validateTemplates, async (req, res) => {
  // ... existing code
});
```

---

## 📊 Logging Implementation (30 minutes)

### 1. Install Winston

```bash
cd Backend
npm install winston
```

### 2. Create Logger

**Create `Backend/utils/logger.ts`:**

```typescript
import winston from 'winston';
import config from '../config';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'zero-config-backend' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

if (config.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

export default logger;
```

### 3. Use Logger

**Update `Backend/app.ts`:**

```typescript
import logger from './utils/logger';

// Replace console.log with logger
logger.info('Server starting...');

// In error handlers:
catch (err) {
  logger.error('Error generating templates', { 
    error: err instanceof Error ? err.message : 'Unknown error',
    stack: err instanceof Error ? err.stack : undefined 
  });
  // ...
}

// At the end:
app.listen(config.port, () => 
  logger.info(`Server running on http://localhost:${config.port}`)
);
```

### 4. Add Request Logging Middleware

**Create `Backend/middleware/requestLogger.ts`:**

```typescript
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
}
```

**Use in app.ts:**

```typescript
import { requestLogger } from './middleware/requestLogger';
app.use(requestLogger);
```

---

## 🚀 Caching Implementation (30 minutes)

### 1. Install Node-Cache

```bash
cd Backend
npm install node-cache
```

### 2. Create Cache Utility

**Create `Backend/utils/cache.ts`:**

```typescript
import NodeCache from 'node-cache';
import logger from './logger';

// Cache GitHub ZIP for 1 hour
const cache = new NodeCache({ 
  stdTTL: 3600,
  checkperiod: 120,
  useClones: false
});

export async function getCachedGitHubZip(
  url: string,
  fetchFn: () => Promise<Buffer>
): Promise<Buffer> {
  const cachedData = cache.get<Buffer>('github-zip');
  
  if (cachedData) {
    logger.debug('Using cached GitHub ZIP');
    return cachedData;
  }
  
  logger.info('Fetching fresh GitHub ZIP');
  const data = await fetchFn();
  cache.set('github-zip', data);
  
  return data;
}

export function clearCache(): void {
  cache.flushAll();
  logger.info('Cache cleared');
}

export default cache;
```

### 3. Use Cache in app.ts

**Update the fetch logic in `Backend/app.ts`:**

```typescript
import { getCachedGitHubZip } from './utils/cache';

// In the POST /api/templates endpoint:
const zipBuffer = await getCachedGitHubZip(
  config.githubRepoUrl,
  async () => {
    const response = await fetch(config.githubRepoUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch templates from GitHub');
    }
    return await response.buffer();
  }
);
```

---

## 🏥 Health Check Endpoint (15 minutes)

**Add to `Backend/app.ts`:**

```typescript
interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  uptime: number;
  timestamp: number;
  environment: string;
  version: string;
}

app.get('/health', (_req: Request, res: Response) => {
  const healthCheck: HealthCheckResponse = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now(),
    environment: config.nodeEnv,
    version: process.env.npm_package_version || '1.0.0',
  };

  res.status(200).json(healthCheck);
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.redirect('/health');
});
```

---

## 📈 Analytics Implementation (45 minutes)

**Create `Backend/utils/analytics.ts`:**

```typescript
import logger from './logger';

interface AnalyticsData {
  totalRequests: number;
  downloads: Record<string, number>;
  errors: number;
  templateCombinations: Record<string, number>;
  startTime: number;
}

class Analytics {
  private data: AnalyticsData;

  constructor() {
    this.data = {
      totalRequests: 0,
      downloads: {},
      errors: 0,
      templateCombinations: {},
      startTime: Date.now(),
    };
  }

  trackRequest(): void {
    this.data.totalRequests++;
  }

  trackDownload(templates: string[]): void {
    const combo = templates.sort().join('-');
    this.data.templateCombinations[combo] = 
      (this.data.templateCombinations[combo] || 0) + 1;

    templates.forEach((template) => {
      this.data.downloads[template] = 
        (this.data.downloads[template] || 0) + 1;
    });
  }

  trackError(): void {
    this.data.errors++;
  }

  getStats(): AnalyticsData & { uptime: number } {
    return {
      ...this.data,
      uptime: Date.now() - this.data.startTime,
    };
  }

  getMostPopular(): { template: string; count: number }[] {
    return Object.entries(this.data.downloads)
      .map(([template, count]) => ({ template, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

export const analytics = new Analytics();
```

**Add analytics endpoint in `Backend/app.ts`:**

```typescript
import { analytics } from './utils/analytics';

// Middleware to track all requests
app.use((_req, _res, next) => {
  analytics.trackRequest();
  next();
});

// Analytics endpoint
app.get('/api/analytics', (_req: Request, res: Response) => {
  const stats = analytics.getStats();
  const popular = analytics.getMostPopular();
  
  res.json({
    stats,
    popular,
  });
});

// Track downloads
app.post('/api/templates', async (req, res) => {
  try {
    const { templates } = req.body;
    
    // ... validation and processing
    
    analytics.trackDownload(templates);
    
    // ... rest of the code
  } catch (err) {
    analytics.trackError();
    // ... error handling
  }
});
```

---

## 🐳 Docker Support (30 minutes)

**Create `Backend/Dockerfile`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start server
CMD ["npm", "start"]
```

**Create `Backend/.dockerignore`:**

```
node_modules
dist
npm-debug.log
.env
.git
.gitignore
*.md
tests
coverage
.vscode
```

**Create `docker-compose.yml` in root:**

```yaml
version: '3.8'

services:
  backend:
    build: ./Backend
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - PORT=8000
    env_file:
      - ./Backend/.env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s

  frontend:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./index.html:/usr/share/nginx/html/index.html:ro
    restart: unless-stopped
```

---

## 📋 Summary Checklist

After implementing these improvements:

- [ ] Environment variables configured
- [ ] TypeScript strict mode enabled
- [ ] ESLint and Prettier set up
- [ ] Tests written and passing
- [ ] Security headers added (Helmet)
- [ ] Input validation implemented
- [ ] Request size limits added
- [ ] Logging system (Winston) configured
- [ ] Caching implemented
- [ ] Health check endpoint added
- [ ] Analytics tracking added
- [ ] Docker support added
- [ ] All scripts in package.json updated

**Run these commands to verify:**

```bash
cd Backend
npm run lint          # Should pass
npm run type-check    # Should pass
npm run test          # Should pass
npm run build         # Should succeed
```

---

*This guide provides a solid foundation for improving the Zero-Config project. Implement these changes incrementally and test thoroughly.*
