import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Device } from '../../device/entities/device.entity';
import { Payment } from '../../billing/entities/payment.entity';
import { RecoveryReport } from '../../recovery/entities/recovery-report.entity';

export enum SubscriptionStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELED = 'canceled',
}

export enum SubscriptionPlan {
  BASIC = 'basic',
  PRO = 'pro',
  FAMILY = 'family',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.INACTIVE,
  })
  subscriptionStatus: SubscriptionStatus;

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    nullable: true,
  })
  subscriptionPlan: SubscriptionPlan;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionExpiresAt: Date;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => RecoveryReport, (report) => report.user)
  recoveryReports: RecoveryReport[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
