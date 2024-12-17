import { PrismaService } from '@/src/prisma.service';
import { Module } from '@nestjs/common';
import { TimerController } from './timer.controller';
import { TimerService } from './timer.service';

@Module({
	controllers: [TimerController],
	providers: [TimerService, PrismaService],
	exports: [TimerService]
})
export class TimerModule {}
