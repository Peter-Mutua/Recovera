import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateRecoveryReportDto {
    @IsString()
    userId: string;

    @IsNumber()
    smsCount: number;

    @IsNumber()
    whatsappCount: number;

    @IsNumber()
    notificationCount: number;

    @IsNumber()
    mediaCount: number;

    @IsString()
    @IsOptional()
    deviceId?: string;

    @IsString()
    @IsOptional()
    metadata?: string;
}
