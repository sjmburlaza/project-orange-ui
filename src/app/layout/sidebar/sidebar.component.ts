import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CtaComponent } from 'src/app/features/common/cta/cta.component';
import { OrderSummaryComponent } from 'src/app/features/common/order-summary/order-summary.component';
import { VoucherComponent } from 'src/app/features/common/voucher/voucher.component';
import { SiteService } from 'src/app/core/services/site.services';

@Component({
  selector: 'app-sidebar',
  imports: [VoucherComponent, OrderSummaryComponent, CtaComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly router = inject(Router);
  readonly siteService = inject(SiteService);

  isCartRoute(): boolean {
    return this.router.url.includes('/cart');
  }
}
