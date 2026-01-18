import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('recovery_reports')
export class RecoveryReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.recoveryReports, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ default: 0 })
    smsCount: number;

    @Column({ default: 0 })
    whatsappCount: number;

    @Column({ default: 0 })
    notificationCount: number;

    @Column({ default: 0 })
    mediaCount: number;

    @Column({ nullable: true })
    deviceId: string;

    @Column({ type: 'text', nullable: true })
    metadata: string;

    @CreateDateColumn()
    createdAt: Date;
}
