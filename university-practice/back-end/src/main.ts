import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('/api')

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))

  app.enableCors({
    origin: 'http://localhost:5173', // Allow specific domain
    methods: 'GET,POST,PATCH,DELETE', // Allow HTTP methods
    credentials: true, // Allow cookies to be sent
    allowedHeaders: 'Content-Type, Authorization',
  })

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
