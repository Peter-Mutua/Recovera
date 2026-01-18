import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { CreatePlanDto, UpdatePlanDto } from '../dto/plan.dto';

@Injectable()
export class PlanService {
    constructor(
        @InjectRepository(SubscriptionPlan)
        private planRepository: Repository<SubscriptionPlan>,
    ) { }

    async create(createPlanDto: CreatePlanDto): Promise<SubscriptionPlan> {
        // Check if plan code already exists
        const existing = await this.planRepository.findOne({
            where: { code: createPlanDto.code },
        });

        if (existing) {
            throw new ConflictException('Plan code already exists');
        }

        const plan = this.planRepository.create(createPlanDto);
        return this.planRepository.save(plan);
    }

    async findAll(): Promise<SubscriptionPlan[]> {
        return this.planRepository.find({
            order: { displayOrder: 'ASC', price: 'ASC' },
        });
    }

    async findActive(): Promise<SubscriptionPlan[]> {
        return this.planRepository.find({
            where: { isActive: true },
            order: { displayOrder: 'ASC', price: 'ASC' },
        });
    }

    async findOne(id: string): Promise<SubscriptionPlan> {
        const plan = await this.planRepository.findOne({ where: { id } });

        if (!plan) {
            throw new NotFoundException('Plan not found');
        }

        return plan;
    }

    async findByCode(code: string): Promise<SubscriptionPlan> {
        const plan = await this.planRepository.findOne({ where: { code } });

        if (!plan) {
            throw new NotFoundException('Plan not found');
        }

        return plan;
    }

    async update(id: string, updatePlanDto: UpdatePlanDto): Promise<SubscriptionPlan> {
        const plan = await this.findOne(id);

        Object.assign(plan, updatePlanDto);

        return this.planRepository.save(plan);
    }

    async remove(id: string): Promise<void> {
        const plan = await this.findOne(id);
        await this.planRepository.remove(plan);
    }

    async toggleActive(id: string): Promise<SubscriptionPlan> {
        const plan = await this.findOne(id);
        plan.isActive = !plan.isActive;
        return this.planRepository.save(plan);
    }
}
