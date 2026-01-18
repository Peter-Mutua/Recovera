import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecoveryReport } from './entities/recovery-report.entity';
import { User } from '../auth/entities/user.entity';
import { RecoveryService } from './services/recovery.service';
import { RecoveryController } from './controllers/recovery.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RecoveryReport, User])],
    controllers: [RecoveryController],
    providers: [RecoveryService],
    exports: [RecoveryService],
})
export class RecoveryModule { }
