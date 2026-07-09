import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnInit,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  imports: [],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTopComponent implements OnInit {
  @Input() ariaLabel = 'Back to top';
  @Input() showAfter = 0;
  @Input() scrollBehavior: ScrollBehavior = 'smooth';

  isVisible = false;

  private readonly browserWindow = inject(DOCUMENT).defaultView;

  ngOnInit(): void {
    this.updateVisibility();
  }

  @HostListener('window:scroll')
  updateVisibility(): void {
    this.isVisible =
      (this.browserWindow?.scrollY ?? 0) > Math.max(this.showAfter, 0);
  }

  scrollToTop(): void {
    if (!this.browserWindow) {
      return;
    }

    const prefersReducedMotion =
      this.browserWindow.matchMedia?.('(prefers-reduced-motion: reduce)')
        .matches ?? false;

    this.browserWindow.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : this.scrollBehavior,
    });
  }
}
