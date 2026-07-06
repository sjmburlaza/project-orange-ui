import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  imports: [AsyncPipe, RouterOutlet, TranslatePipe],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly titleKey$ = this.router.events.pipe(
    startWith(null),
    filter((event) => event === null || event instanceof NavigationEnd),
    map(() => this.getActiveRouteTitleKey()),
  );

  private getActiveRouteTitleKey(): string {
    let route = this.route;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const titleKey = route.snapshot.data['titleKey'];

    return typeof titleKey === 'string' ? titleKey : 'auth.titles.account';
  }
}
