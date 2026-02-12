import { IsString, IsNumber, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsNumber()
  price!: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsString()
  sku!: string;

  @IsNumber()
  stock!: number;

  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
