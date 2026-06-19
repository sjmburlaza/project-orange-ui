import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { OrderItem } from 'src/app/core/models/order.model';
import { OrderItemComponent } from 'src/app/features/orders/components/order-item/order-item.component';
import { OrderService } from 'src/app/features/orders/services/order.service';

@Component({
  selector: 'app-orders',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    OrderItemComponent,
    TranslatePipe,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  private readonly fb = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly destroyRef = inject(DestroyRef);

  readonly lookupForm = this.fb.nonNullable.group({
    orderNumber: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });
  readonly order = signal<OrderItem | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly searchedEmail = signal('');

  get orderNumber() {
    return this.lookupForm.controls.orderNumber;
  }

  get email() {
    return this.lookupForm.controls.email;
  }

  onSubmit(): void {
    const formValue = this.lookupForm.getRawValue();
    const orderNumber = formValue.orderNumber.trim();
    const email = formValue.email.trim();

    this.lookupForm.setValue({ orderNumber, email }, { emitEvent: false });

    if (this.lookupForm.invalid) {
      this.lookupForm.markAllAsTouched();
      this.errorMessage.set('');
      this.order.set(null);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.order.set(null);
    this.searchedEmail.set(email);

    this.orderService
      .lookupOrder(orderNumber, email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (order) => {
          if (!this.emailMatchesOrder(order, email)) {
            this.showLookupNotFound();
            return;
          }

          this.order.set(order);
          this.isLoading.set(false);
        },
        error: () => {
          this.showLookupNotFound();
        },
      });
  }

  private emailMatchesOrder(order: OrderItem, email: string): boolean {
    return (
      !order.customerEmail ||
      order.customerEmail.trim().toLowerCase() === email.toLowerCase()
    );
  }

  private showLookupNotFound(): void {
    this.order.set(null);
    this.errorMessage.set('orders.lookup.errors.notFound');
    this.isLoading.set(false);
  }
}
