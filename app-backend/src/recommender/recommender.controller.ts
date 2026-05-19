import { Controller, Post, Get, Body } from '@nestjs/common';
import { RecommenderService } from './recommender.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HybridRecommendationDto } from './dto/HybridRecommendation.dto';

@ApiTags('Recommender')
@Controller('recommender')
export class RecommenderController {
  constructor(private readonly recommenderService: RecommenderService) {}

  @Post('recommend-hybrid')
  @ApiOperation({ summary: 'Get hybrid personalized recipe recommendations' })
  @ApiResponse({ status: 200, description: 'Successfully generated recommendations.' })
  @ApiResponse({ status: 400, description: 'Invalid request payload.' })
  async recommendHybrid(@Body() payload: HybridRecommendationDto): Promise<any> {
    const result = await this.recommenderService.getHybridRecommendation(payload);
    return result;
  }

  @Get('/health')
  @ApiOperation({ summary: 'Check health of the recommender service' })
  @ApiResponse({ status: 200, description: 'Recommender service is healthy.' })
  async healthCheck(): Promise<any> {
    const result = await this.recommenderService.getHealthCheck();
    return result;
  }
}
