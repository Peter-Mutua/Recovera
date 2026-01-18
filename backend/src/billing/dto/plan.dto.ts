import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, Min, Max } from 'class-validator';

export class CreatePlanDto {
    @IsString()
    code: string;

    @IsString()
    name: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    @IsOptional()
    currency?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsString({ each: true })
    features: string[];

    @IsNumber()
    @Min(1)
    @Max(10)
    maxDevices: number;

    @IsNumber()
    @Min(1)
    dataRetentionDays: number;

    @IsBoolean()
    smsRecovery: boolean;

    @IsBoolean()
    notificationRecovery: boolean;

    @IsBoolean()
    whatsappRecovery: boolean;

    @IsBoolean()
    mediaRecovery: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    exportFormats?: string[];

    @IsNumber()
    @Min(1)
    supportResponseHours: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsNumber()
    @IsOptional()
    displayOrder?: number;

    @IsString()
    @IsOptional()
    badge?: string;
}

export class UpdatePlanDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    features?: string[];

    @IsNumber()
    @Min(1)
    @Max(10)
    @IsOptional()
    maxDevices?: number;

    @IsNumber()
    @Min(1)
    @IsOptional()
    dataRetentionDays?: number;

    @IsBoolean()
    @IsOptional()
    smsRecovery?: boolean;

    @IsBoolean()
    @IsOptional()
    notificationRecovery?: boolean;

    @IsBoolean()
    @IsOptional()
    whatsappRecovery?: boolean;

    @IsBoolean()
    @IsOptional()
    mediaRecovery?: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    exportFormats?: string[];

    @IsNumber()
    @Min(1)
    @IsOptional()
    supportResponseHours?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsNumber()
    @IsOptional()
    displayOrder?: number;

    @IsString()
    @IsOptional()
    badge?: string;
}
