import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('subscription_plans')
export class SubscriptionPlan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string; // 'basic', 'pro', 'family'

    @Column()
    name: string; // 'Basic Plan', 'Pro Plan', etc.

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number; // Monthly price

    @Column({ default: 'KES' })
    currency: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'json' })
    features: string[]; // Array of feature strings

    @Column({ default: 1 })
    maxDevices: number;

    @Column({ default: 30 })
    dataRetentionDays: number; // How long users can access recovered data

    @Column({ default: true })
    smsRecovery: boolean;

    @Column({ default: true })
    notificationRecovery: boolean;

    @Column({ default: false })
    whatsappRecovery: boolean;

    @Column({ default: false })
    mediaRecovery: boolean;

    @Column({ type: 'json', nullable: true })
    exportFormats: string[]; // ['text', 'pdf', 'csv', 'html']

    @Column({ default: 48 })
    supportResponseHours: number; // Support response time in hours

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 0 })
    displayOrder: number; // For sorting plans

    @Column({ type: 'text', nullable: true })
    badge: string; // 'Recommended', 'Best Value', etc.

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
