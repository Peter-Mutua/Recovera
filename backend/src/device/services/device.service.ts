import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../entities/device.entity';
import { User, SubscriptionPlan } from '../../auth/entities/user.entity';
import { BindDeviceDto } from '../dto/device.dto';

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async bindDevice(dto: BindDeviceDto) {
        const user = await this.userRepository.findOne({
            where: { id: dto.userId },
            relations: ['devices'],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check device limit based on plan
        const maxDevices = user.subscriptionPlan === SubscriptionPlan.FAMILY ? 3 : 1;
        const activeDevices = user.devices.filter((d) => d.isActive);

        if (activeDevices.length >= maxDevices) {
            throw new ConflictException(
                `Maximum ${maxDevices} device(s) allowed for your plan`,
            );
        }

        // Check if device already exists
        const existingDevice = await this.deviceRepository.findOne({
            where: { deviceId: dto.deviceId },
        });

        if (existingDevice) {
            throw new ConflictException('Device already registered');
        }

        // Create new device
        const device = this.deviceRepository.create({
            ...dto,
            userId: user.id,
            lastActiveAt: new Date(),
        });

        await this.deviceRepository.save(device);

        return {
            deviceId: device.id,
            message: 'Device bound successfully',
        };
    }

    async listDevices(userId: string) {
        const devices = await this.deviceRepository.find({
            where: { userId, isActive: true },
            select: ['id', 'deviceId', 'model', 'osVersion', 'lastActiveAt', 'createdAt'],
        });

        return devices;
    }

    async deleteDevice(deviceId: string) {
        const device = await this.deviceRepository.findOne({ where: { id: deviceId } });
        if (!device) {
            throw new NotFoundException('Device not found');
        }

        device.isActive = false;
        await this.deviceRepository.save(device);

        return { message: 'Device removed successfully' };
    }
}
