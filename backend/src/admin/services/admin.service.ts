import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, SubscriptionStatus } from '../../auth/entities/user.entity';
import { Payment } from '../../billing/entities/payment.entity';
import { Device } from '../../device/entities/device.entity';
import { RecoveryReport } from '../../recovery/entities/recovery-report.entity';
import { GetUsersDto, GetPaymentsDto } from '../dto/admin.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>,
        @InjectRepository(RecoveryReport)
        private reportRepository: Repository<RecoveryReport>,
    ) { }

    async getUsers(query: GetUsersDto) {
        const { page = 1, limit = 20, status } = query;
        const skip = (page - 1) * limit;

        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (status) {
            queryBuilder.where('user.subscriptionStatus = :status', { status });
        }

        const [users, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .orderBy('user.createdAt', 'DESC')
            .getManyAndCount();

        return {
            data: users.map((user) => ({
                id: user.id,
                email: user.email,
                subscriptionStatus: user.subscriptionStatus,
                subscriptionPlan: user.subscriptionPlan,
                isBlocked: user.isBlocked,
                createdAt: user.createdAt,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getUserById(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['devices', 'payments', 'recoveryReports'],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            subscriptionStatus: user.subscriptionStatus,
            subscriptionPlan: user.subscriptionPlan,
            subscriptionExpiresAt: user.subscriptionExpiresAt,
            isBlocked: user.isBlocked,
            createdAt: user.createdAt,
            devices: user.devices,
            payments: user.payments,
            totalScans: user.recoveryReports.length,
        };
    }

    async blockUser(userId: string, isBlocked: boolean) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.isBlocked = isBlocked;
        await this.userRepository.save(user);

        return {
            message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
        };
    }

    async getPayments(query: GetPaymentsDto) {
        const { page = 1, limit = 20, status } = query;
        const skip = (page - 1) * limit;

        const queryBuilder = this.paymentRepository
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.user', 'user');

        if (status) {
            queryBuilder.where('payment.status = :status', { status });
        }

        const [payments, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .orderBy('payment.createdAt', 'DESC')
            .getManyAndCount();

        return {
            data: payments,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getDevices(userId?: string) {
        const queryBuilder = this.deviceRepository
            .createQueryBuilder('device')
            .leftJoinAndSelect('device.user', 'user');

        if (userId) {
            queryBuilder.where('device.userId = :userId', { userId });
        }

        const devices = await queryBuilder
            .orderBy('device.lastActiveAt', 'DESC')
            .getMany();

        return devices;
    }

    async getStatistics() {
        const [
            totalUsers,
            activeSubscriptions,
            totalPayments,
            todayReports,
        ] = await Promise.all([
            this.userRepository.count(),
            this.userRepository.count({
                where: { subscriptionStatus: SubscriptionStatus.ACTIVE },
            }),
            this.paymentRepository
                .createQueryBuilder('payment')
                .select('SUM(payment.amount)', 'total')
                .where('payment.status = :status', { status: 'completed' })
                .getRawOne(),
            this.reportRepository
                .createQueryBuilder('report')
                .where('DATE(report.createdAt) = CURRENT_DATE')
                .getCount(),
        ]);

        const totalRevenue = totalPayments?.total || 0;

        return {
            totalUsers,
            activeSubscriptions,
            totalRevenue: parseFloat(totalRevenue),
            todayScans: todayReports,
            conversionRate:
                totalUsers > 0
                    ? ((activeSubscriptions / totalUsers) * 100).toFixed(2)
                    : 0,
        };
    }
}
