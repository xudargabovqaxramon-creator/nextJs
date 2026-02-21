import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    forbidNonWhitelisted:true,
    whitelist:true
  }))

  // swagger 
  const config = new DocumentBuilder()
  .setTitle("Article project")
  .setDescription("article documantation")
  .setVersion("1.0.0")
  .addBearerAuth({
    type: "http",
    scheme: "bearer",
    name: "JWT",
    bearerFormat: "JWT",
    description: "JWT token from header",
    in: "header"
  })
  .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })

  const PORT = process.env.PORT ?? 3000

  await app.listen(PORT,  () =>{
    console.log("Server is running at: http://localhost:4001");
    console.log("Documantation link: http://localhost:4001/api");
  });
}
bootstrap();