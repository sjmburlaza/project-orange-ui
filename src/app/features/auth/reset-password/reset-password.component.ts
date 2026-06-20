import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { SiteService } from 'src/app/core/services/site.services';
import { emailValidator } from 'src/app/shared/validators/email.validator';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly siteService = inject(SiteService);
  private readonly site = this.siteService.currentSite();

  readonly resetPasswordForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, emailValidator()]],
    token: ['', [Validators.required]],
    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/),
      ],
    ],
  });

  readonly passwordRules = [
    {
      label: 'At least 8 characters',
      valid: () => this.newPasswordValue.length >= 8,
    },
    {
      label: 'At least one uppercase letter',
      valid: () => /[A-Z]/.test(this.newPasswordValue),
    },
    {
      label: 'At least one number',
      valid: () => /\d/.test(this.newPasswordValue),
    },
    {
      label: 'At least one special character',
      valid: () => /[^a-zA-Z0-9]/.test(this.newPasswordValue),
    },
  ];

  isLoading = false;
  isComplete = false;
  errorMessage: string | null = null;
  hidePassword = true;

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    const email = params.get('email') ?? '';
    const token = params.get('token') ?? params.get('resetToken') ?? '';

    this.resetPasswordForm.patchValue({ email, token });
  }

  get email() {
    return this.resetPasswordForm.controls.email;
  }

  get token() {
    return this.resetPasswordForm.controls.token;
  }

  get newPassword() {
    return this.resetPasswordForm.controls.newPassword;
  }

  get newPasswordValue(): string {
    return this.newPassword.value ?? '';
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService
      .resetPassword(this.resetPasswordForm.getRawValue())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.isComplete = true;
        },
        error: (error) => {
          console.error('Password reset failed:', error);

          this.errorMessage =
            'This reset link is invalid or expired. Request a new reset link and try again.';
        },
      });
  }

  goToForgotPassword(): void {
    this.router.navigate([`/${this.site}/auth/forgot-password`]);
  }

  goToLogin(): void {
    this.router.navigate([`/${this.site}/auth/login`]);
  }
}
