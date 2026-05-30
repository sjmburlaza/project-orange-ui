import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { map, of } from 'rxjs';
import { DynamicField } from 'src/app/core/models/checkout.model';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';

@Component({
  selector: 'app-dynamic-form',
  imports: [
    ReactiveFormsModule,
    DynamicFieldComponent,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent implements OnInit {
  http = inject(HttpClient);

  @Input({ required: true }) fields!: DynamicField[];
  @Output() submitted = new EventEmitter<any>();

  form!: FormGroup;

  ngOnInit() {
    this.form = this.buildForm(this.fields);
  }

  submit() {}

  buildForm(fields: DynamicField[]): FormGroup {
    const group: Record<string, AbstractControl> = {};

    fields?.forEach((f) => {
      const validators = this.mapValidators(f.validators || []);
      const asyncValidators = this.mapAsyncValidators(f.asyncValidators || []);

      switch (f.type) {
        case 'group':
          group[f.name] = this.buildForm(f.fields || []);
          break;

        case 'array': {
          const formArray = new FormArray<FormGroup>([]);

          if (f.fields) {
            formArray.push(this.buildForm(f.fields));
          }
          group[f.name] = formArray;
          break;
        }

        default:
          group[f.name] = new FormControl('', validators, asyncValidators);
      }
    });

    return new FormGroup(group);
  }

  getGridClass(field: DynamicField) {
    const mobile = field.grid?.mobile ?? 12;
    const tablet = field.grid?.tablet ?? mobile;
    const desktop = field.grid?.desktop ?? 6;

    return `col-${mobile} col-md-${tablet} col-lg-${desktop}`;
  }

  private mapValidators(rules: string[] = []): ValidatorFn[] {
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

  private mapAsyncValidators(rules: string[] = []): AsyncValidatorFn[] {
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
