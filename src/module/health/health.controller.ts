import { Controller, Get, HttpCode } from '@nestjs/common';
import {
  ApiExcludeController,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiExcludeController(true)
@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor() {}

  @ApiOperation({
    summary: 'Health',
    description: 'OK',
  })
  @Get()
  @ApiOkResponse({ type: String, description: 'OK' })
  @HttpCode(200)
  check(): string {
    return 'OK';
  }
}
