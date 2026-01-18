import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { PaymentProvider } from '../entities/payment.entity';

export class CreatePaymentIntentDto {
    @IsString()
    userId: string;

    @IsEnum(['basic', 'pro', 'family'])
    plan: string;

    @IsEnum(PaymentProvider)
    provider: PaymentProvider;

    @IsOptional()
    @IsString()
    phoneNumber?: string; // Required for M-Pesa and Airtel Money
}

export class VerifyPaymentDto {
    @IsString()
    reference: string;

    @IsEnum(PaymentProvider)
    provider: PaymentProvider;
}
