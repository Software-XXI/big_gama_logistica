import { IsString, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SyncReportDto {
  @IsString()
  id: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  operatorId: string;

  @IsOptional()
  @IsString()
  companionId?: string;

  @IsOptional()
  @IsString()
  conductorId?: string;

  @IsOptional()
  @IsString()
  bitacora?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncItemDto)
  items?: SyncItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncPhotoDto)
  photos?: SyncPhotoDto[];
}

export class SyncItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
}

export class SyncPhotoDto {
  @IsString()
  id: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  type?: string;
}

export class SyncResponseDto {
  success: boolean;
  synced?: number;
  errors?: string[];
  message?: string;
}