import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { RecommenderService } from './recommender.service';
import { RecommenderController } from './recommender.controller';

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads .env variables
    HttpModule,
  ],
  controllers: [RecommenderController],
  providers: [RecommenderService],
  exports: [RecommenderService],
})
export class RecommenderModule {}