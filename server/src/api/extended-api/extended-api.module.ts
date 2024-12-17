import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { extendedApiController } from './extended-api.controller';
import { extendedApiService } from './extended-api.service';


@Module({
	controllers: [extendedApiController],
	providers: [extendedApiService],
	exports: [extendedApiService],
	imports: [HttpModule, ConfigModule]
})
export class extendedApiModule {}
