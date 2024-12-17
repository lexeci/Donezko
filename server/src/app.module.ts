import { AuthModule } from '@/api/auth/auth.module';
import { extendedApiModule } from '@/api/extended-api/extended-api.module';
import { OrgModule } from '@/api/org/org.module';
import { PermissionModule } from '@/api/permission/permission.module';
import { ProjectModule } from '@/api/project/project.module';
import { TaskModule } from '@/api/task/task.module';
import { TimeBlockModule } from '@/api/time-block/time-block.module';
import { TimerModule } from '@/api/timer/timer.module';
import { UserModule } from '@/api/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		PermissionModule,
		UserModule,
		OrgModule,
		ProjectModule,
		TaskModule,
		TimeBlockModule,
		TimerModule,
		extendedApiModule
	]
})
export class AppModule {}
