import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableShutdownHooks();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // Serve static files
  // Serve files from backend/uploads (same directory UploadService writes to).
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Enable CORS
  // `frontend` дээрх запросууд зөвхөн `Authorization` header-оор JWT явуулдаг тул cookies хэрэггүй.
  // Origin таарахгүй бол browser "Failed to fetch" / CORS алдаагаар request-ийг тасалдаг.
  const corsOrigin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL;
  let normalizedOrigins = corsOrigin
    ? corsOrigin
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];
  // Local `next dev` (localhost:3000) → production API on Render: allow preflight without editing CORS_ORIGIN.
  // Set CORS_ALLOW_LOCALHOST_DEV=false on Render if you must forbid local origins.
  const allowLocalNextDev = process.env.CORS_ALLOW_LOCALHOST_DEV !== 'false';
  if (normalizedOrigins.length > 0 && allowLocalNextDev) {
    const localNext = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    normalizedOrigins = [...new Set([...normalizedOrigins, ...localNext])];
  }
  app.enableCors({
    // Хэрвээ origin тодорхойлоогүй бол бүх origin-ыг зөвшөөрнө.
    // Render/Vercel дээр env-г яг тохируулахгүйгээс үүдэлтэй гардаг блоклалтыг арилгана.
    origin: normalizedOrigins.length > 0 ? normalizedOrigins : true,
    credentials: false,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger API documentation
  if (process.env.ENABLE_SWAGGER === 'true' || process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('ДААЦЫН ЦАМХАГ API')
      .setDescription('Corporate website API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
