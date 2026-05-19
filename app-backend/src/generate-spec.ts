import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  console.log('Bootstrapping NestJS application context to generate Swagger spec...');
  
  // Set an environment variable so modules know we are in building/generating mode if needed
  process.env.GENERATING_SWAGGER = 'true';
  
  try {
    // Create the application context silently without starting the web server
    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
    
    console.log('NestJS context initialized. Building Swagger document...');
    const config = new DocumentBuilder()
      .setTitle('Recipelens REST API')
      .setDescription('The NestJS API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
      
    const document = SwaggerModule.createDocument(app, config);
    
    // Ensure the public/api-docs directory exists
    const outputDir = path.join(__dirname, '..', 'public', 'api-docs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`Created directory: ${outputDir}`);
    }
    
    const outputPath = path.join(outputDir, 'swagger-spec.json');
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf8');
    
    console.log(`Swagger OpenAPI specification generated successfully at: ${outputPath}`);
    
    // Close the NestJS app gracefully
    await app.close();
    console.log('NestJS context closed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error generating Swagger specification:', error);
    process.exit(1);
  }
}

bootstrap();
