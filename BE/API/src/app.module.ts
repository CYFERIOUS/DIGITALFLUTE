import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModule } from './data/data.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, DataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
