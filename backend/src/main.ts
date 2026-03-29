import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { UsersService } from './users/users.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  const usersService = app.get(UsersService)
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const existingAdmin = await usersService.findByUsername(adminUsername)

  if (!existingAdmin) {
    await usersService.createUser(adminUsername, adminPassword, undefined, 'Admin')
    console.log(`Created default admin user: ${adminUsername}`)
  }

  const config = new DocumentBuilder()
    .setTitle('Lottery Admin API')
    .setDescription('API for admin backend and user frontend')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(Number(process.env.PORT || 3001))
}
bootstrap()
