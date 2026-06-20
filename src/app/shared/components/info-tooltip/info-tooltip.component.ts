import { Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-info-tooltip',
  imports: [MatTooltipModule],
  templateUrl: './info-tooltip.component.html',
  styleUrl: './info-tooltip.component.scss',
})
export class InfoTooltipComponent {
  @Input({ required: true }) description!: string;
  @Input({ required: true }) label!: string;
}
