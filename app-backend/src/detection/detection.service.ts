import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { inferenceRequest } from './detection.controller';

@Injectable()
export class DetectionService {
  private readonly inferenceServerUrl = process.env.INFERENCE_SERVER_URL;
  private readonly workspace_name = process.env.WORKSPACE_NAME;
  private readonly workflow_id = process.env.WORKFLOW_ID;
  private readonly inferece_api_key = process.env.ROBOFLOW_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  getInference(data: any): Observable<any> {
    return this.httpService
      .post(`${this.inferenceServerUrl}/infer`, data)
      .pipe(map((response) => response.data));
  }

  async getWorkflowInference(data: inferenceRequest): Promise<any> {
    const endpoint = `/${this.workspace_name}/workflows/${this.workflow_id}`;
    const payload = {
      api_key: this.inferece_api_key,
      inputs: {
        image: [data.image],
      },
    };
    console.log(this.inferenceServerUrl.concat(endpoint));

    const response$ = this.httpService.post(
      this.inferenceServerUrl.concat(endpoint),
      payload,
    );
    const response = await lastValueFrom(response$);
    const ingredientList = Array.from(
        new Set(response.data.outputs[0].predictions?.predictions.map((p: any) => p.class))
      );
    return {
      ingredients: ingredientList,
      outputs: response.data.outputs,
    };
  }

  async getInferenceFromRoboflow(data: inferenceRequest): Promise<any> {
    const endpoint = process.env.ROBOFLOW_WORKFLOW_BASE;
    const payload = {
      api_key: this.inferece_api_key,
      inputs: {
        image: {
          type: 'base64',
          value: data.image,
        },
      },
    };

    const response$ = this.httpService.post(endpoint, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await lastValueFrom(response$);
    const ingredientList = Array.from(
        new Set(response.data.outputs[0].predictions?.predictions.map((p: any) => p.class))
      );
    return {
      ingredients: ingredientList,
      outputs: response.data.outputs,
    };
  }

  async detection(data: inferenceRequest): Promise<any> {
    const endpoint = `${process.env.DETECTION_ENDPOINT}/detect`;
    const payload = {
      image: data.image,
    };

    const response$ = this.httpService.post(endpoint, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await lastValueFrom(response$);

    return response.data;
  }
}
