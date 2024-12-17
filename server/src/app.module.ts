import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { extendedApiModule } from './extended-api/extended-api.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { TimeBlockModule } from './time-block/time-block.module';
import { TimerModule } from './timer/timer.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		TaskModule,
		TimeBlockModule,
		TimerModule,
		extendedApiModule
	]
})
export class AppModule {}
