import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { User } from '../auth/entities/user.entity';
import { DeviceService } from './services/device.service';
import { DeviceController } from './controllers/device.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Device, User])],
    controllers: [DeviceController],
    providers: [DeviceService],
    exports: [DeviceService],
})
export class DeviceModule { }
