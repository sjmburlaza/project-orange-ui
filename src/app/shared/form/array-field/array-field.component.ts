import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicField } from 'src/app/shared/form/dynamic-field.model';
import { DynamicFieldComponent } from 'src/app/shared/form/dynamic-field/dynamic-field.component';

@Component({
  selector: 'app-array-field',
  imports: [
    ReactiveFormsModule,
    // MatAnchor,
    forwardRef(() => DynamicFieldComponent),
  ],
  templateUrl: './array-field.component.html',
  styleUrl: './array-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayFieldComponent {
  @Input() field!: DynamicField;
  @Input() form!: FormGroup;

  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<any>();

  get array() {
    return this.form.get(this.field.name) as any;
  }
}
