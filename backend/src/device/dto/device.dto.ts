import { IsString, IsOptional } from 'class-validator';

export class BindDeviceDto {
    @IsString()
    userId: string;

    @IsString()
    deviceId: string;

    @IsString()
    model: string;

    @IsString()
    @IsOptional()
    osVersion?: string;
}
