import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DynamicField } from 'src/app/core/models/checkout.model';
import { OptionsService } from 'src/app/core/services/options.service';

@Component({
  selector: 'app-select-search-field',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './select-search-field.component.html',
  styleUrl: './select-search-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSearchFieldComponent implements OnInit {
  optionsService = inject(OptionsService);

  @Input() field!: DynamicField;
  @Input() form!: FormGroup;

  options: any[] = [];

  ngOnInit() {
    this.load();
    if (this.field.dependsOn) {
      const parent = this.form.get(this.field.dependsOn)!;

      if (!parent.value) {
        this.form.get(this.field.name)?.disable();
      }

      parent.valueChanges.subscribe((value) => {
        const control = this.form.get(this.field.name);
        control?.reset();
        if (value) {
          control?.enable();
          this.load(value);
        } else {
          control?.disable();
        }
      });
    }
  }

  load(parentValue?: any) {
    const params: any = {};

    if (parentValue) {
      params.parent = parentValue;
    }

    this.optionsService
      .getOptions(this.field.optionsApi!, params)
      .subscribe((res) => {
        this.options = res;
      });
  }

  search(term: string) {
    this.optionsService
      .getOptions(this.field.optionsApi!, { search: term })
      .subscribe((res) => {
        this.options = res;
      });
  }

  onSearchClick(event: Event) {
    event.stopPropagation();
  }

  onSearchKeydown(event: KeyboardEvent) {
    event.stopPropagation();
  }
}
