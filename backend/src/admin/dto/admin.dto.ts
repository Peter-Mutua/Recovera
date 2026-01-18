import { IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class GetUsersDto {
    @IsOptional()
    @IsNumber()
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    limit?: number = 20;

    @IsOptional()
    status?: string;
}

export class BlockUserDto {
    @IsBoolean()
    isBlocked: boolean;
}

export class GetPaymentsDto {
    @IsOptional()
    @IsNumber()
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    limit?: number = 20;

    @IsOptional()
    status?: string;
}
