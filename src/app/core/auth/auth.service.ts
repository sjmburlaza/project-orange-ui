import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AuthSession,
  LoginDto,
  RegisterDto,
} from 'src/app/core/auth/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/auth';
  private readonly requestOptions = { withCredentials: true };

  login(dto: LoginDto): Observable<AuthSession> {
    return this.http.post<AuthSession>(
      `${this.baseUrl}/login`,
      dto,
      this.requestOptions,
    );
  }

  register(dto: RegisterDto): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/register`,
      dto,
      this.requestOptions,
    );
  }

  getSession(): Observable<AuthSession> {
    return this.http.get<AuthSession>(
      `${this.baseUrl}/session`,
      this.requestOptions,
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/logout`,
      {},
      this.requestOptions,
    );
  }
}
