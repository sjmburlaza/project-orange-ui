import { AsyncPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ArrayFieldComponent } from 'src/app/shared/form/array-field/array-field.component';
import { CheckboxFieldComponent } from 'src/app/shared/form/checkbox-field/checkbox-field.component';
import { DynamicField } from 'src/app/shared/form/dynamic-field.model';
import { FieldVisibilityService } from 'src/app/shared/form/field-visibility.service';
import { GroupFieldComponent } from 'src/app/shared/form/group-field/group-field.component';
import { InputFieldComponent } from 'src/app/shared/form/input-field/input-field.component';
import { SelectFieldComponent } from 'src/app/shared/form/select-field/select-field.component';
import { SelectSearchFieldComponent } from 'src/app/shared/form/select-search-field/select-search-field.component';

@Component({
  selector: 'app-dynamic-field',
  imports: [
    InputFieldComponent,
    SelectFieldComponent,
    SelectSearchFieldComponent,
    CheckboxFieldComponent,
    ArrayFieldComponent,
    GroupFieldComponent,
    AsyncPipe,
  ],
  templateUrl: './dynamic-field.component.html',
  styleUrl: './dynamic-field.component.scss',
})
export class DynamicFieldComponent implements OnInit {
  visibility = inject(FieldVisibilityService);

  @Input() field!: DynamicField;
  @Input() form!: FormGroup;

  @Output() addArray = new EventEmitter<void>();
  @Output() removeArray = new EventEmitter<any>();

  visible$!: Observable<boolean>;

  ngOnInit() {
    this.visible$ = this.visibility.watch(this.field, this.form);

    this.visible$.subscribe((visible) => {
      const control = this.form.get(this.field.name);
      if (!control) return;
      if (visible) {
        control.enable();
      } else {
        control.disable();
      }
    });
  }
}
