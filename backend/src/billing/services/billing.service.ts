import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentProvider } from '../entities/payment.entity';
import { User, SubscriptionStatus, SubscriptionPlan } from '../../auth/entities/user.entity';
import { CreatePaymentIntentDto, VerifyPaymentDto } from '../dto/billing.dto';

@Injectable()
export class BillingService {
    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createPaymentIntent(dto: CreatePaymentIntentDto) {
        const user = await this.userRepository.findOne({ where: { id: dto.userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Get plan price
        const planPrices = {
            [SubscriptionPlan.BASIC]: 400, // $4 in cents
            [SubscriptionPlan.PRO]: 800,   // $8 in cents
            [SubscriptionPlan.FAMILY]: 1200, // $12 in cents
        };

        const amount = planPrices[dto.plan];
        const reference = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create payment record
        const payment = this.paymentRepository.create({
            reference,
            userId: user.id,
            amount: amount / 100, // Convert cents to dollars
            currency: 'USD',
            plan: dto.plan,
            provider: PaymentProvider.STRIPE, // Default to Stripe
            status: PaymentStatus.PENDING,
        });

        await this.paymentRepository.save(payment);

        return {
            reference,
            amount,
            currency: 'USD',
            paymentUrl: `https://checkout.stripe.com/pay/${reference}`, // Placeholder
        };
    }

    async verifyPayment(dto: VerifyPaymentDto) {
        const payment = await this.paymentRepository.findOne({
            where: { reference: dto.reference },
            relations: ['user'],
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        // TODO: Verify with actual payment provider
        // For now, we'll mark as completed
        payment.status = PaymentStatus.COMPLETED;
        await this.paymentRepository.save(payment);

        // Update user subscription
        const user = await this.userRepository.findOne({ where: { id: payment.userId } });
        user.subscriptionStatus = SubscriptionStatus.ACTIVE;
        user.subscriptionPlan = payment.plan as SubscriptionPlan;
        user.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await this.userRepository.save(user);

        return {
            status: 'active',
            plan: payment.plan,
            expiresAt: user.subscriptionExpiresAt,
        };
    }

    async getSubscriptionStatus(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            status: user.subscriptionStatus,
            plan: user.subscriptionPlan,
            expiresAt: user.subscriptionExpiresAt,
        };
    }
}
