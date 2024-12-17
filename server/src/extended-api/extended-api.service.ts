import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class extendedApiService {
	constructor(
		private httpService: HttpService,
		private configService: ConfigService
	) {}

	async getByIp(userIpAddress: string) {
		const apiKey = this.configService.get('WEATHER_API_KEY');
		const { data } = await firstValueFrom(
			this.httpService
				.get(
					`http://api.weatherapi.com/v1/current.json?q=${userIpAddress}&key=${apiKey}`
				)
				.pipe(
					catchError((error: AxiosError) => {
						throw new UnauthorizedException(error.response.data);
					})
				)
		);
		return data;
	}

	async getAdvice() {
		const { data } = await firstValueFrom(
			this.httpService.get('https://api.adviceslip.com/advice').pipe(
				catchError((error: AxiosError) => {
					throw new UnauthorizedException(error.response.data);
				})
			)
		);
		return data;
	}
}
