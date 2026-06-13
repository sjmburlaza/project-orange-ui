import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { emailValidator } from 'src/app/shared/validators/email.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { SiteService } from 'src/app/core/services/site.services';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly siteService = inject(SiteService);
  private readonly site = this.siteService.currentSite();

  readonly registerForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, emailValidator()]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly passwordRules = [
    {
      label: 'At least 6 characters',
      valid: () => this.passwordValue.length >= 6,
    },
    {
      label: 'At least one special character',
      valid: () => /[^a-zA-Z0-9]/.test(this.passwordValue),
    },
    {
      label: 'At least one number',
      valid: () => /\d/.test(this.passwordValue),
    },
    {
      label: 'At least one uppercase letter',
      valid: () => /[A-Z]/.test(this.passwordValue),
    },
  ];

  submitted = false;
  errorCode: string | null = null;
  isLoading = false;
  hidePassword = true;

  get fullName() {
    return this.registerForm.controls.fullName;
  }

  get email() {
    return this.registerForm.controls.email;
  }

  get password() {
    return this.registerForm.controls.password;
  }

  get passwordValue(): string {
    return this.password.value ?? '';
  }

  onSubmit(): void {
    this.errorCode = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService
      .register(this.registerForm.getRawValue())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.goToLogin();
        },
        error: (error) => {
          console.error('Register failed:', error);

          this.errorCode =
            error.error?.code ?? 'Something went wrong. Please try again.';
        },
      });
  }

  goToLogin(): void {
    this.router.navigate([`/${this.site}/auth/login`]);
  }
}
