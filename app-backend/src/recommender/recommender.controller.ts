import { Controller, Post, Get, Body } from '@nestjs/common';
import { RecommenderService } from './recommender.service';

type HybridRecommendationRequest = {
  user_id?: string;
  query: string;
  k?: number;
};

@Controller('recommender')
export class RecommenderController {
  constructor(private readonly recommenderService: RecommenderService) {}

  @Post('recommend-hybrid')
  async recommendHybrid(@Body() payload: HybridRecommendationRequest): Promise<any> {

    const result = await this.recommenderService.getHybridRecommendation(payload);
    return result;
  }

  @Get('/health')
  async healthCheck(): Promise<any> {
    const result = await this.recommenderService.getHealthCheck();
    return result;
  }
}
