import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { AnalyticsInfoTooltip } from 'src/app/core/models/analytics.model';

@Component({
  selector: 'app-info-tooltip',
  templateUrl: './info-tooltip.component.html',
  styleUrl: './info-tooltip.component.scss',
})
export class InfoTooltipComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  @ViewChild('tooltip') private tooltip?: ElementRef<HTMLElement>;

  @Input({ required: true }) info!: AnalyticsInfoTooltip;
  @Input({ required: true }) label!: string;

  readonly tooltipId = `info-tooltip-${nextTooltipId++}`;
  isTooltipOpen = false;
  tooltipLeft = 0;
  tooltipTop = 0;

  @HostListener('window:resize')
  repositionOpenTooltip(): void {
    if (this.isTooltipOpen) {
      this.positionTooltip();
    }
  }

  showTooltip(): void {
    this.isTooltipOpen = true;
    this.positionTooltip();
  }

  hideTooltip(): void {
    this.isTooltipOpen = false;
  }

  private positionTooltip(): void {
    const tooltip = this.tooltip?.nativeElement;

    if (!tooltip) return;

    const viewportPadding = 12;
    const triggerRect = this.host.nativeElement.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const centeredLeft =
      triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
    const maxLeft = window.innerWidth - tooltipWidth - viewportPadding;
    const belowTop = triggerRect.bottom + 8;
    const aboveTop = triggerRect.top - tooltipHeight - 8;

    this.tooltipLeft = clamp(centeredLeft, viewportPadding, maxLeft);
    this.tooltipTop =
      belowTop + tooltipHeight > window.innerHeight - viewportPadding
        ? Math.max(viewportPadding, aboveTop)
        : belowTop;
  }
}

let nextTooltipId = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}
