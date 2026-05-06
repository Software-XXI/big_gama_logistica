import { IsString, IsOptional, IsEnum, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportStatus } from '@prisma/client';

export class CreateReportDto {
  @IsString()
  code: string;

  @IsString()
  operatorId: string;

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
  @Type(() => ReportItemDto)
  items?: ReportItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhotoDto)
  photos?: PhotoDto[];
}

export class ReportItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
}

export class PhotoDto {
  @IsString()
  url: string;

  @IsOptional()
  @IsEnum(['EVIDENCE', 'INVENTORY', 'OTHER'])
  type?: 'EVIDENCE' | 'INVENTORY' | 'OTHER';
}

export class UpdateReportDto {
  @IsOptional()
  @IsString()
  operatorId?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'SYNCED', 'PROCESSING', 'COMPLETED', 'REJECTED'])
  status?: ReportStatus;

  @IsOptional()
  @IsString()
  bitacora?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}