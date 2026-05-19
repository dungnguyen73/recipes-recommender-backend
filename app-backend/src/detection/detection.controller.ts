import { Controller, Post, Body } from '@nestjs/common';
import { DetectionService } from './detection.service';
import { ApiProperty, ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

export class inferenceRequest {
  @ApiProperty({ 
    example: 'base64 string', 
    description: 'Base64 string of the image to be analyzed' 
  })
  image: string;
}

@ApiTags('Detection')
@Controller('detection')
export class DetectionController {
  constructor(private readonly inferenceService: DetectionService) {}


  @Post('/v1')
  @ApiOperation({ summary: 'Detect objects using Roboflow API' })
  @ApiBody({ type: inferenceRequest })
  async detect(@Body() data: inferenceRequest) { 
    return this.inferenceService.getInferenceFromRoboflow(data);
  }

  @Post('/v2')
  @ApiOperation({ summary: 'Infer objects using model from Roboflow' })
  @ApiBody({ type: inferenceRequest })
  async infer(@Body() data: inferenceRequest) {
    return this.inferenceService.getWorkflowInference(data);
  }

  @Post('/v3')
  @ApiOperation({ summary: 'Detect objects using yolo model' })
  @ApiBody({ type: inferenceRequest })
  async detectV3(@Body() data: inferenceRequest) {
    return this.inferenceService.detection(data);
  }
}
