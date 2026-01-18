import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('devices')
export class Device {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    deviceId: string;

    @Column()
    model: string;

    @Column({ nullable: true })
    osVersion: string;

    @Column({ nullable: true })
    appVersion: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.devices, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'timestamp', nullable: true })
    lastActiveAt: Date;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
