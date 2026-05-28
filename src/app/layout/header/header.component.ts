import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { AuthStore } from 'src/app/core/auth/auth.store';
import { SiteService } from 'src/app/core/services/site.services';
import { CartFacade } from 'src/app/features/cart/store/cart.facade';

@Component({
  selector: 'app-header',
  imports: [MatBadgeModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private readonly cartFacade = inject(CartFacade);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  readonly siteService = inject(SiteService);
  readonly itemCount$ = this.cartFacade.itemCount$;
  readonly site = this.siteService.currentSite();

  readonly accountMenuItems = [
    {
      label: 'Orders',
      action: () => this.goToOrders(),
    },
    {
      label: 'Your Saves',
      action: () => this.goToSaves(),
    },
    {
      label: 'Account',
      action: () => this.goToAccount(),
    },
    {
      label: this.authStore.isAuthenticated() ? 'Sign Out' : 'Sign In',
      action: () =>
        this.authStore.isAuthenticated() ? this.logout() : this.goToLogin(),
    },
  ];

  ngOnInit(): void {
    this.cartFacade.loadCart();
  }

  goToCart(): void {
    this.router.navigate([`/${this.site}/cart`]);
  }

  goToProducts(): void {
    this.router.navigate([`/${this.site}/products`]);
  }

  goToOrders() {}
  goToSaves() {}
  goToAccount() {}
  goToLogin() {}

  logout() {}
}
