import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password, deviceId, deviceInfo } = registerDto;

        // Check if user exists
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Create user (password will be hashed automatically by @BeforeInsert hook)
        const user = this.userRepository.create({
            email,
            password,
        });

        await this.userRepository.save(user);

        // Generate token
        const token = this.generateToken(user);

        return {
            token,
            userId: user.id,
            email: user.email,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Find user
        const user = await this.userRepository.findOne({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check if user is blocked
        if (user.isBlocked) {
            throw new UnauthorizedException('Account is blocked');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate token
        const token = this.generateToken(user);

        return {
            token,
            userId: user.id,
            email: user.email,
            subscriptionStatus: user.subscriptionStatus,
            subscriptionPlan: user.subscriptionPlan,
        };
    }

    async forgotPassword(email: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            // Don't reveal if email exists
            return { message: 'If email exists, reset link has been sent' };
        }

        // Generate reset token
        const resetToken = randomBytes(32).toString('hex');
        const resetExpires = new Date();
        resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await this.userRepository.save(user);

        // TODO: Send email with reset link
        // const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        // await emailService.send(user.email, 'Password Reset', resetUrl);

        console.log(`Reset token for ${email}: ${resetToken}`);

        return { message: 'If email exists, reset link has been sent' };
    }

    async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({
            where: { resetPasswordToken: token },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid or expired reset token');
        }

        // Check if token expired
        if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
            throw new UnauthorizedException('Reset token has expired');
        }

        // Update password (will be hashed automatically)
        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.userRepository.save(user);

        return { message: 'Password successfully reset' };
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        user.password = newPassword;
        await this.userRepository.save(user);

        return { message: 'Password changed successfully' };
    }

    async validateUser(userId: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id: userId } });
    }

    private generateToken(user: User): string {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload);
    }
}
