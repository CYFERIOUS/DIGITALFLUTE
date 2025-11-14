import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS to allow requests from frontend
  // This configuration prevents CORS errors for all endpoints
  app.enableCors({
    origin: true, // Allow all origins (for development)
    // For production, specify exact origins:
    // origin: ['http://localhost:3000', 'http://localhost:80', 'https://yourdomain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
    ],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  
  await app.listen(process.env.PORT ?? 5000);
  console.log(`Backend server running on port ${process.env.PORT ?? 5000}`);
  console.log('CORS enabled for all endpoints');
}
bootstrap();
