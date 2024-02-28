import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@config/app';
import { validationSchema } from '@config/app/config.schema';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroOrmConfig } from '@config/orm/mikro.config';
import { CommonModule } from '@common/common.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [appConfig],
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MikroOrmConfig,
    }),
    CommonModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
