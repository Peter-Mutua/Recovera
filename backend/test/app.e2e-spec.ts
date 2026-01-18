import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Recovera E2E Tests', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Flow', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          password: 'password123',
          deviceId: 'test-device-001',
          deviceInfo: 'Test Device',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('userId');
          expect(res.body).toHaveProperty('email');
          authToken = res.body.token;
          userId = res.body.userId;
        });
    });

    it('should login existing user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('subscriptionStatus');
        });
    });

    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Billing Flow', () => {
    it('should create payment intent', () => {
      return request(app.getHttpServer())
        .post('/billing/create-intent')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId,
          plan: 'pro',
          provider: 'mpesa',
          phoneNumber: '254712345678',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('reference');
          expect(res.body).toHaveProperty('amount', 800);
          expect(res.body).toHaveProperty('currency', 'KES');
        });
    });

    it('should verify payment', () => {
      return request(app.getHttpServer())
        .post('/billing/verify')
        .send({
          reference: 'test-reference',
          provider: 'mpesa',
        })
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
        });
    });
  });

  describe('Device Management', () => {
    it('should bind device', () => {
      return request(app.getHttpServer())
        .post('/device/bind')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId,
          deviceId: 'device-002',
          model: 'Samsung Galaxy S21',
          osVersion: 'Android 13',
        })
        .expect(201);
    });

    it('should list user devices', () => {
      return request(app.getHttpServer())
        .get(`/device/list/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Recovery Reports', () => {
    it('should submit recovery report', () => {
      return request(app.getHttpServer())
        .post('/recovery/report')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId,
          smsCount: 150,
          whatsappCount: 5,
          notificationCount: 80,
          mediaCount: 25,
          deviceId: 'test-device-001',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('reportId');
        });
    });

    it('should get recovery history', () => {
      return request(app.getHttpServer())
        .get(`/recovery/history/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Admin Endpoints', () => {
    it('should get statistics', () => {
      return request(app.getHttpServer())
        .get('/admin/statistics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalUsers');
          expect(res.body).toHaveProperty('activeSubscriptions');
          expect(res.body).toHaveProperty('totalRevenue');
        });
    });

    it('should get all users', () => {
      return request(app.getHttpServer())
        .get('/admin/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
        });
    });
  });
});
