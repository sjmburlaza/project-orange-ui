import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnalyticsService } from 'libs/core/services/analytics.service';
import { BackToTopComponent } from 'libs/ui/back-to-top/back-to-top.component';

@Component({
  selector: 'app-root',
  imports: [BackToTopComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.trackVisitor();
  }
}
