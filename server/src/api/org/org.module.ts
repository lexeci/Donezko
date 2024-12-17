import { PrismaService } from '@/src/prisma.service';
import { Module } from '@nestjs/common';
import { OrgController } from './org.controller';
import { OrgService } from './org.service';

@Module({
	controllers: [OrgController],
	providers: [OrgService, PrismaService],
	exports: [OrgService]
})
export class OrgModule {}
