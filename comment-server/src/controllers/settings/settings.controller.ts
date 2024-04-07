import { Controller, Get, Patch, Body } from '@nestjs/common';
import { LatencyInterceptor } from '../../interceptors/latency.interceptor';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { isNumber } from "@nestjs/common/utils/shared.utils";
import { UpdateLatencyDto } from "../../model/requests/update-latency.dto";
import { SettingsDto } from "../../model/responses/settings.dto";

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  // Method to get the current delay
  @Get('latency')
  @ApiOperation({ summary: 'Get the settings' })
  @ApiResponse({
    status: 200,
    description: 'Successfully returned the settings',
    type: SettingsDto,
  })
  getLatency() {
    return { delay: LatencyInterceptor.delay };
  }

  // Existing method to update latency
  @Patch('latency')
  @ApiOperation({ summary: 'Update the latency' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the latency',
    type: SettingsDto,
  })
  updateLatency(@Body() dto: UpdateLatencyDto) {
    LatencyInterceptor.delay = dto.delay;
    return { delay: dto.delay };
  }
}
