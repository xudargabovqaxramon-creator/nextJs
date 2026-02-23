import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { Auth } from './module/auth/entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './module/article/entities/article.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guard/auth.guard';
import { RolesGuard } from './common/guard/role.guard';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: ".env", isGlobal:true}),
    TypeOrmModule.forRoot({
      type: "postgres",
      username: "postgres",
      port:5432,
      host: "localhost",
      password: String(process.env.DB_PASSWORD),
      database:String(process.env.DB_NAME),
      entities:[Auth, Article],
      synchronize:true,
      logging:false
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
