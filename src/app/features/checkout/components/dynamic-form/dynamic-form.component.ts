import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DynamicField } from 'src/app/core/models/checkout.model';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';
import { ValidatorMapperService } from '../../services/validator-mapper.service';

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
export class DynamicFormComponent implements OnInit, OnChanges {
  private readonly validatorService = inject(ValidatorMapperService);

  @Input({ required: true }) fields!: DynamicField[];
  @Input() initialValue: Record<string, any> | null = null;

  @Output() submitForm = new EventEmitter<any>();

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.buildForm(this.fields);
    this.patchInitialValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] && this.form) {
      this.patchInitialValue();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitForm.emit(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  getValue(): any {
    return this.form.getRawValue();
  }

  validateAndGetValue(): any | null {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return null;
    }

    return this.form.getRawValue();
  }

  isValid(): boolean {
    return this.form.valid;
  }

  markAllAsTouched(): void {
    this.form.markAllAsTouched();
  }

  buildForm(fields: DynamicField[]): FormGroup {
    const group: Record<string, AbstractControl> = {};

    fields?.forEach((f) => {
      const validators = this.validatorService.mapValidators(
        f.validators || [],
      );
      const asyncValidators = this.validatorService.mapAsyncValidators(
        f.asyncValidators || [],
      );

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

  private patchInitialValue(): void {
    if (this.initialValue) {
      this.form.patchValue(this.initialValue);
    }
  }
}
