import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
