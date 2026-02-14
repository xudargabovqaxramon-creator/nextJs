import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { Auth } from './auth/entities/auth.entity';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: ".env", isGlobal:true}),
    SequelizeModule.forRoot({
      dialect: "postgres",
      username: "postgres",
      port:5432,
      host: "localhost",
      password: String(process.env.DB_PASSWORD),
      database:String(process.env.DB_NAME),
      autoLoadModels:true,
      models:[Auth],
      synchronize:true,
      logging:false
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
