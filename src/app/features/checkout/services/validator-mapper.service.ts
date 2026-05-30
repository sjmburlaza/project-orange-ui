import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ValidatorFn,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ValidatorMapperService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/checkout';

  mapValidators(rules: string[] = []): ValidatorFn[] {
    return rules.map((rule) => {
      if (rule === 'required') return Validators.required;
      if (rule === 'email') return Validators.email;
      if (rule.startsWith('minLength')) {
        const len = +rule.split(':')[1];
        return Validators.minLength(len);
      }
      return Validators.nullValidator;
    });
  }

  mapAsyncValidators(rules: string[] = []): AsyncValidatorFn[] {
    return rules.map((rule) => {
      if (rule === 'uniqueEmail') {
        return this.uniqueEmailValidator();
      }

      return () => of(null);
    });
  }

  private uniqueEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.http
        .get<boolean>(`/api/check-email?email=${control.value}`)
        .pipe(map((exists) => (exists ? { emailTaken: true } : null)));
    };
  }
}
