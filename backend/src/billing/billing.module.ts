import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { User } from '../auth/entities/user.entity';
import { BillingService } from './services/billing.service';
import { PlanService } from './services/plan.service';
import { BillingController } from './controllers/billing.controller';
import { PlanController, PublicPlanController } from './controllers/plan.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, SubscriptionPlan, User])],
    controllers: [BillingController, PlanController, PublicPlanController],
    providers: [BillingService, PlanService],
    exports: [BillingService, PlanService],
})
export class BillingModule { }
