import { inject, Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DynamicField } from 'src/app/shared/form/dynamic-field.model';
import { ValidatorMapperService } from 'src/app/shared/form/validator-mapper.service';

@Injectable({ providedIn: 'root' })
export class FormFactoryService {
  validatorMapper = inject(ValidatorMapperService);

  buildForm(fields: DynamicField[]): FormGroup {
    const group: any = {};

    fields.forEach((field) => {
      const validators = this.validatorMapper.mapValidators(
        field.validators || [],
      );
      const asyncValidators = this.validatorMapper.mapAsyncValidators(
        field.asyncValidators || [],
      );

      switch (field.type) {
        case 'group':
          group[field.name] = this.buildForm(field.fields || []);
          break;

        case 'array':
          const formArray = new FormArray<FormGroup>([]);
          if (field.fields) {
            formArray.push(this.buildForm(field.fields));
          }
          group[field.name] = formArray;
          break;

        default:
          group[field.name] = new FormControl('', validators, asyncValidators);
      }
    });

    return new FormGroup(group);
  }
}
