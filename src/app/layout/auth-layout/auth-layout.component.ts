import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  imports: [AsyncPipe, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly title$ = this.router.events.pipe(
    startWith(null),
    filter((event) => event === null || event instanceof NavigationEnd),
    map(() => this.getActiveRouteTitle()),
  );

  private getActiveRouteTitle(): string {
    let route = this.route;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const title = route.snapshot.data['title'];

    return typeof title === 'string' ? title : 'Account';
  }
}
