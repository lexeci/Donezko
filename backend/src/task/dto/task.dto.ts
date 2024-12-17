import { Priority } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class TaskDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  isCompleted: boolean

  @IsString()
  @IsOptional()
  createdAt: string

  @IsEnum(Priority)
  @IsOptional()
  @Transform(({value}) => ('' + value).toLowerCase)
  priority: Priority
}
