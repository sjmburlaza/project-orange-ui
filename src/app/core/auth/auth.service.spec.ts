import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('requests a password reset through the auth API', () => {
    const dto = { email: 'juan@example.com' };
    const response = {
      resetToken: 'reset-token',
      resetUrl: '/ph/auth/reset-password?token=reset-token',
    };

    service.requestPasswordReset(dto).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = http.expectOne('/api/auth/forgot-password');

    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body).toEqual(dto);
    req.flush(response);
  });

  it('completes a password reset through the auth API', () => {
    const dto = {
      email: 'juan@example.com',
      token: 'reset-token',
      newPassword: 'NewPassw0rd!',
    };

    service.resetPassword(dto).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = http.expectOne('/api/auth/reset-password');

    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body).toEqual(dto);
    req.flush(null);
  });
});
