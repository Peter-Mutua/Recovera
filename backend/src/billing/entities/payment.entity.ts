import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum PaymentProvider {
    MPESA = 'mpesa',
    AIRTEL_MONEY = 'airtel_money',
    CARDS = 'cards',
    STRIPE = 'stripe',
    PAYSTACK = 'paystack',
    GOOGLE_PLAY = 'google_play',
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    reference: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ default: 'KES' })
    currency: string;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @Column({
        type: 'enum',
        enum: PaymentProvider,
    })
    provider: PaymentProvider;

    @Column()
    plan: string;

    @Column({ type: 'text', nullable: true })
    providerResponse: string;

    @Column({ nullable: true })
    phoneNumber: string; // For M-Pesa and Airtel Money

    @CreateDateColumn()
    createdAt: Date;
}
