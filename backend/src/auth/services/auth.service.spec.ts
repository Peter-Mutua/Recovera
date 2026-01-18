import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let userRepository: Repository<User>;
    let jwtService: JwtService;

    const mockUserRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should successfully register a new user', async () => {
            const registerDto = {
                email: 'test@example.com',
                password: 'password123',
                deviceId: 'device-123',
                deviceInfo: 'Samsung Galaxy S21',
            };

            mockUserRepository.findOne.mockResolvedValue(null);
            mockUserRepository.create.mockReturnValue({
                id: 'user-id',
                email: registerDto.email,
            });
            mockUserRepository.save.mockResolvedValue({
                id: 'user-id',
                email: registerDto.email,
            });
            mockJwtService.sign.mockReturnValue('jwt-token');

            const result = await service.register(registerDto);

            expect(result).toEqual({
                token: 'jwt-token',
                userId: 'user-id',
                email: registerDto.email,
            });
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { email: registerDto.email },
            });
        });

        it('should throw ConflictException if email already exists', async () => {
            const registerDto = {
                email: 'existing@example.com',
                password: 'password123',
                deviceId: 'device-123',
                deviceInfo: 'Samsung Galaxy S21',
            };

            mockUserRepository.findOne.mockResolvedValue({
                id: 'existing-user',
                email: registerDto.email,
            });

            await expect(service.register(registerDto)).rejects.toThrow(
                ConflictException,
            );
        });
    });

    describe('login', () => {
        it('should successfully login a user', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'password123',
            };

            const mockUser = {
                id: 'user-id',
                email: loginDto.email,
                password: '$2b$10$hashedpassword',
                isBlocked: false,
                subscriptionStatus: 'active',
                subscriptionPlan: 'pro',
            };

            mockUserRepository.findOne.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue('jwt-token');

            // Mock bcrypt.compare to return true
            jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);

            const result = await service.login(loginDto);

            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('userId');
            expect(result.email).toBe(loginDto.email);
        });

        it('should throw UnauthorizedException for invalid credentials', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };

            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should throw UnauthorizedException for blocked user', async () => {
            const loginDto = {
                email: 'blocked@example.com',
                password: 'password123',
            };

            mockUserRepository.findOne.mockResolvedValue({
                id: 'user-id',
                email: loginDto.email,
                isBlocked: true,
            });

            await expect(service.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });
});
