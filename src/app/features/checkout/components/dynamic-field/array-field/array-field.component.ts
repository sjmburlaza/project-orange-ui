import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicFieldComponent } from '../dynamic-field.component';
import { DynamicField } from 'src/app/core/models/checkout.model';

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
