import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { FieldValidator } from 'src/app/core/models/checkout.model';

@Injectable({ providedIn: 'root' })
export class ValidatorMapperService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/checkout';

  getValidators(validators: FieldValidator[]): ValidatorFn[] {
    return validators.map((validator) => {
      switch (validator.name) {
        case 'required':
          return Validators.required;

        case 'email':
          return Validators.email;

        case 'maxLength':
          return Validators.maxLength(Number(validator.value));

        case 'minLength':
          return Validators.minLength(Number(validator.value));

        default:
          return Validators.nullValidator;
      }
    });
  }
}
