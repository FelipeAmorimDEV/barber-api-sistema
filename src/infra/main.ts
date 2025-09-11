import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = 3334

  // Configuração do CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Gestão de Barbearia')
    .setDescription('API completa para gestão de barbearia com agendamentos, clientes, barbeiros e serviços')
    .setVersion('1.0')
    .addTag('usuarios', 'Gestão de usuários do sistema')
    .addTag('clientes', 'Gestão de clientes')
    .addTag('barbeiros', 'Gestão de barbeiros')
    .addTag('servicos', 'Gestão de serviços')
    .addTag('agendamentos', 'Gestão de agendamentos')
    .addTag('avaliacoes', 'Gestão de avaliações')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  console.log(`📚 Documentação Swagger disponível em: http://localhost:${port}/api/docs`);
 
  await app.listen(port);
}
bootstrap();
