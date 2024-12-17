// permission/permission.decorator.ts
import { JwtAuthGuard } from '@/api/auth/guards/jwt.guards';
import { PermissionType } from '@/src/types/permissions.types';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../guards/permission.guard';

// Декоратор, який використовуватиме список дозволів
export const Permission = (...permissions: PermissionType[]) =>
	applyDecorators(
		SetMetadata('permissions', permissions), // Передаємо дозволи через метадані
		UseGuards(JwtAuthGuard, PermissionGuard) // Використовуємо глобальний guard
	);
