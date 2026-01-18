import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BillingService } from '../services/billing.service';
import { CreatePaymentIntentDto, VerifyPaymentDto } from '../dto/billing.dto';

@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    @Post('create-intent')
    async createPaymentIntent(@Body() dto: CreatePaymentIntentDto) {
        return this.billingService.createPaymentIntent(dto);
    }

    @Post('verify')
    async verifyPayment(@Body() dto: VerifyPaymentDto) {
        return this.billingService.verifyPayment(dto);
    }

    @Get('status/:userId')
    async getSubscriptionStatus(@Param('userId') userId: string) {
        return this.billingService.getSubscriptionStatus(userId);
    }
}
