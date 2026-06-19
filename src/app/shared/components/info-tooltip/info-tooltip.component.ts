import { Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AnalyticsInfoTooltip } from 'src/app/core/models/analytics.model';

@Component({
  selector: 'app-info-tooltip',
  imports: [MatTooltipModule],
  templateUrl: './info-tooltip.component.html',
  styleUrl: './info-tooltip.component.scss',
})
export class InfoTooltipComponent {
  @Input({ required: true }) info!: AnalyticsInfoTooltip;
  @Input({ required: true }) label!: string;
}
