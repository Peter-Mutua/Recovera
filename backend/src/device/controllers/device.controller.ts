import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { DeviceService } from '../services/device.service';
import { BindDeviceDto } from '../dto/device.dto';

@Controller('device')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) { }

    @Post('bind')
    async bindDevice(@Body() dto: BindDeviceDto) {
        return this.deviceService.bindDevice(dto);
    }

    @Get('list/:userId')
    async listDevices(@Param('userId') userId: string) {
        return this.deviceService.listDevices(userId);
    }

    @Delete(':id')
    async deleteDevice(@Param('id') deviceId: string) {
        return this.deviceService.deleteDevice(deviceId);
    }
}
