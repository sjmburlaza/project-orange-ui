import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { finalize, map } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthStore } from 'src/app/core/auth/auth.store';
import { SiteService } from 'src/app/core/services/site.services';
import { CartFacade } from 'src/app/features/cart/store/cart.facade';
import headerCnMockData from 'src/assets/mock/header/header.cn.json';
import headerFrMockData from 'src/assets/mock/header/header.fr.json';
import headerJpMockData from 'src/assets/mock/header/header.jp.json';
import headerMockData from 'src/assets/mock/header/header.json';

interface HeaderNavItem {
  displayName: string;
  path?: string;
  queryParams: { category: string } | null;
}

interface HeaderData {
  navItems: HeaderNavItem[];
}

@Component({
  selector: 'app-header',
  imports: [
    MatBadgeModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
  ],
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
  readonly site = this.siteService.currentSite;

  private readonly headerBySite: Record<string, HeaderData> = {
    ph: headerMockData as HeaderData,
    fr: headerFrMockData as HeaderData,
    cn: headerCnMockData as HeaderData,
    jp: headerJpMockData as HeaderData,
  };

  readonly navItems = computed(
    () => (this.headerBySite[this.site()] ?? this.headerBySite['ph']).navItems,
  );

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

  get isCheckoutRoute(): boolean {
    return this.router.url.includes('/checkout');
  }

  goToCart(): void {
    this.router.navigate([`/${this.site()}/cart`]);
  }

  goToOrders(): void {
    this.router.navigate([`/${this.site()}/orders/my-orders`]);
  }

  goToSaves(): void {
    this.router.navigate([`/${this.site()}/profile`]);
  }

  goToAccount(): void {
    this.router.navigate([`/${this.site()}/profile/account-settings`]);
  }

  goToLogin(): void {
    this.router.navigate([`/${this.site()}/auth/login`]);
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
