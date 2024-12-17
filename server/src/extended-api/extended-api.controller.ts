import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { extendedApiService } from './extended-api.service';

@Controller('extended-api')
export class extendedApiController {
	constructor(private readonly extendedApiService: extendedApiService) {}

	@HttpCode(200)
	@Get('weather')
	async getByIp(@Query('ip') userIpAddress: string) {
		return await this.extendedApiService.getByIp(userIpAddress);
	}

  @HttpCode(200)
	@Get('advice')
	async getAdvice() {
		return await this.extendedApiService.getAdvice();
	}
}
