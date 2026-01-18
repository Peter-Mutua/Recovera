import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RecoveryService } from '../services/recovery.service';
import { CreateRecoveryReportDto } from '../dto/recovery.dto';

@Controller('recovery')
export class RecoveryController {
    constructor(private readonly recoveryService: RecoveryService) { }

    @Post('report')
    async createReport(@Body() dto: CreateRecoveryReportDto) {
        return this.recoveryService.createReport(dto);
    }

    @Get('history/:userId')
    async getHistory(@Param('userId') userId: string) {
        return this.recoveryService.getHistory(userId);
    }
}
