import {ConfigService} from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export const getJwtConfig = async (
  confirmService: ConfigService
): Promise<JwtModuleOptions> => ({
  secret: confirmService.get('JWT_SECRET')
});