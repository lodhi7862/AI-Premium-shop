import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class PromoteToAdminDto {
  @IsString()
  userId!: string;
}

export class UpdateUserStatusDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserRoleDto {
  @IsString()
  role!: 'ADMIN' | 'CUSTOMER' | 'VENDOR';
}
