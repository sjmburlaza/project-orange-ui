import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { finalize, map } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
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
  private readonly authService = inject(AuthService);
  readonly siteService = inject(SiteService);
  readonly itemCount$ = this.cartFacade.itemCount$;
  readonly site = this.siteService.currentSite();

  readonly accountMenuItems$ = this.authStore.isAuthenticated$.pipe(
    map((isAuthenticated) => [
      {
        label: 'Orders',
        icon: 'bi-box-seam',
        action: () => this.goToOrders(),
      },
      {
        label: 'Your Saves',
        icon: 'bi-bookmark',
        action: () => this.goToSaves(),
      },
      {
        label: 'Account',
        icon: 'bi-person',
        action: () => this.goToAccount(),
      },
      {
        label: isAuthenticated ? 'Sign Out' : 'Sign In',
        icon: isAuthenticated ? 'bi-box-arrow-right' : 'bi-box-arrow-in-right',
        action: () => (isAuthenticated ? this.logout() : this.goToLogin()),
      },
    ]),
  );

  ngOnInit(): void {
    this.cartFacade.loadCart();
  }

  goToCart(): void {
    this.router.navigate([`/${this.site}/cart`]);
  }

  goToProducts(): void {
    this.router.navigate([`/${this.site}/products`]);
  }

  goToOrders(): void {
    this.router.navigate([`/${this.site}/profile/orders`]);
  }

  goToSaves(): void {
    this.router.navigate([`/${this.site}/profile`]);
  }

  goToAccount(): void {
    this.router.navigate([`/${this.site}/profile/account-settings`]);
  }

  goToLogin(): void {
    this.router.navigate([`/${this.site}/auth/login`]);
  }

  logout(): void {
    this.authService
      .logout()
      .pipe(
        finalize(() => {
          this.authStore.clearSession();
          this.goToLogin();
        }),
      )
      .subscribe({
        error: (error) => {
          console.error('Logout failed:', error);
        },
      });
  }
}
