import { PrismaService } from '@/src/prisma.service';
import { Module } from '@nestjs/common';
import { PermissionGuard } from './guards/permission.guard';

@Module({
	providers: [PermissionGuard, PrismaService],
	exports: [PermissionGuard] // Експортуємо PermissionService, щоб інші модулі могли використовувати
})
export class PermissionModule {}
