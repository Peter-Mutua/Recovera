import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { GetUsersDto, GetPaymentsDto, BlockUserDto } from '../dto/admin.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('users')
    async getUsers(@Query() query: GetUsersDto) {
        return this.adminService.getUsers(query);
    }

    @Get('users/:id')
    async getUserById(@Param('id') userId: string) {
        return this.adminService.getUserById(userId);
    }

    @Post('users/:id/block')
    async blockUser(@Param('id') userId: string, @Body() dto: BlockUserDto) {
        return this.adminService.blockUser(userId, dto.isBlocked);
    }

    @Get('payments')
    async getPayments(@Query() query: GetPaymentsDto) {
        return this.adminService.getPayments(query);
    }

    @Get('devices')
    async getDevices(@Query('userId') userId?: string) {
        return this.adminService.getDevices(userId);
    }

    @Get('statistics')
    async getStatistics() {
        return this.adminService.getStatistics();
    }
}
