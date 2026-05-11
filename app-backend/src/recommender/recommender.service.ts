import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RecommenderService {
  private recommenderServiceBase: string;
  private recommenderEndPoint: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {

    this.recommenderServiceBase = process.env.RECOMMENDER_URL;
    this.recommenderEndPoint = `/recommend/hybrid`;
  }

  async getHealthCheck(): Promise<any> {
    const response$ = this.httpService.get(
        this.recommenderServiceBase.concat('/health'));
        
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getHybridRecommendation(payload: any): Promise<any> {

    const response$ = this.httpService.post(
        this.recommenderServiceBase.concat(this.recommenderEndPoint), 
        payload);
        
    const response = await lastValueFrom(response$);
    return response.data;
  }
}
