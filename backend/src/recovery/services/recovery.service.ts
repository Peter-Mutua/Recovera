import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecoveryReport } from '../entities/recovery-report.entity';
import { User } from '../../auth/entities/user.entity';
import { CreateRecoveryReportDto } from '../dto/recovery.dto';

@Injectable()
export class RecoveryService {
    constructor(
        @InjectRepository(RecoveryReport)
        private reportRepository: Repository<RecoveryReport>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createReport(dto: CreateRecoveryReportDto) {
        const user = await this.userRepository.findOne({ where: { id: dto.userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const report = this.reportRepository.create(dto);
        await this.reportRepository.save(report);

        return {
            reportId: report.id,
            summary: {
                sms: report.smsCount,
                whatsapp: report.whatsappCount,
                notifications: report.notificationCount,
                media: report.mediaCount,
            },
        };
    }

    async getHistory(userId: string) {
        const reports = await this.reportRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 10,
        });

        return reports;
    }
}
