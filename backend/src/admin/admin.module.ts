import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Payment } from '../billing/entities/payment.entity';
import { Device } from '../device/entities/device.entity';
import { RecoveryReport } from '../recovery/entities/recovery-report.entity';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Payment, Device, RecoveryReport])],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService],
})
export class AdminModule { }
