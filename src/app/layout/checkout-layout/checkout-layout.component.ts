import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CartFacade } from 'src/app/features/cart/store/cart.facade';
import { FooterComponent } from 'src/app/layout/footer/footer.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import { IconPipe } from 'src/app/shared/pipes/icon-pipe';
import { MatAnchor } from '@angular/material/button';
import { SiteService } from 'src/app/core/services/site.services';

@Component({
  selector: 'app-checkout-layout',
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    SidebarComponent,
    AsyncPipe,
    TranslatePipe,
    IconPipe,
    MatAnchor,
    RouterLink,
  ],
  templateUrl: './checkout-layout.component.html',
  styleUrl: './checkout-layout.component.scss',
})
export class CheckoutLayoutComponent {
  private readonly cartFacade = inject(CartFacade);
  private readonly router = inject(Router);
  readonly siteService = inject(SiteService);
  readonly site = this.siteService.currentSite;
  readonly itemCount$ = this.cartFacade.itemCount$;

  get isOrderConfirmationRoute(): boolean {
    return this.router.url.includes('/orders/confirmation/');
  }
}
