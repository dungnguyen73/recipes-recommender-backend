import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DetectionController } from './detection.controller';
import { DetectionService } from './detection.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads .env variables
    HttpModule,
  ],
  controllers: [DetectionController],
  providers: [DetectionService],
  exports: [DetectionService],
})
export class DetectionModule {}