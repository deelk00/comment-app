import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LatencyInterceptor } from './interceptors/latency.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // apply interceptors
  app.useGlobalInterceptors(new LatencyInterceptor());

  // apply automatic documentation
  // Create a document builder
  const config = new DocumentBuilder()
    .setTitle('Comments API')
    .setDescription('The comments API description')
    .setVersion('1.0')
    .addTag('comments')
    .build();

  // Create a Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Serve the Swagger document at /api
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap().catch((err) => {
  console.log('oh no');
  console.error(err);
});
