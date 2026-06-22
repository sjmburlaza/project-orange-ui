import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ROLES } from 'src/app/core/auth/auth.constants';
import { AuthSession } from 'src/app/core/auth/auth.models';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthStore } from 'src/app/core/auth/auth.store';
import { SiteService } from 'src/app/core/services/site.services';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly siteService = inject(SiteService);
  private readonly site = this.siteService.currentSite();

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.authStore.setSession(response);
          this.router.navigate([this.getPostLoginUrl(response)]);
        },
        error: (error) => {
          console.error('Login failed:', error);

          this.loginForm.setErrors({
            loginFailed: true,
          });
        },
      });
  }

  goToRegister(): void {
    this.router.navigate([`/${this.site}/auth/register`]);
  }

  goToForgotPassword(): void {
    this.router.navigate([`/${this.site}/auth/forgot-password`]);
  }

  private getPostLoginUrl(response: AuthSession): string {
    return response.user.roles.includes(ROLES.ADMIN)
      ? `/${this.site}/admin/analytics-dashboard`
      : `/${this.site}/cart`;
  }
}
