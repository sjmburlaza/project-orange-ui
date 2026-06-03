import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { CartFacade } from '../../cart/store/cart.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-voucher',
  imports: [AsyncPipe, ReactiveFormsModule, TranslatePipe],
  templateUrl: './voucher.component.html',
  styleUrl: './voucher.component.scss',
})
export class VoucherComponent implements OnInit {
  private readonly cartFacade = inject(CartFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = new FormBuilder();
  readonly appliedVouchers$ = this.cartFacade.appliedVouchers$;
  readonly voucherError$ = this.cartFacade.voucherError$;
  submitted = false;

  readonly voucherForm = this.fb.group({
    voucherCode: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {
    this.voucherCode.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.submitted = false;
        this.cartFacade.clearVoucherError();
      });
  }

  get voucherCode() {
    return this.voucherForm.controls.voucherCode;
  }

  applyVoucher(): void {
    this.submitted = true;

    const code = this.voucherCode.value?.trim();

    if (this.voucherForm.invalid || !code) return;

    this.cartFacade.applyVoucher(code);
  }

  removeVoucher(code: string): void {
    if (!code) return;

    this.cartFacade.removeVoucher(code);
  }
}
