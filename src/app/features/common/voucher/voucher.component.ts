import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-voucher',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './voucher.component.html',
  styleUrl: './voucher.component.scss',
})
export class VoucherComponent implements OnInit {
  private readonly fb = new FormBuilder();
  submitted = false;

  readonly voucherForm = this.fb.group({
    voucherCode: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {
    this.voucherCode.valueChanges.subscribe(() => {
      this.submitted = false;
    });
  }

  get voucherCode() {
    return this.voucherForm.controls.voucherCode;
  }

  applyVoucher(): void {
    this.submitted = true;

    const code = this.voucherCode.value?.trim();

    if (!code) return;
  }
}
