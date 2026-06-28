import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  inject,
} from '@angular/core';

export interface CarouselItemContext {
  $implicit: unknown;
  index: number;
}

export type CarouselTrackByFn = (item: unknown, index: number) => unknown;

@Directive({
  selector: 'ng-template[appCarouselItem]',
})
export class CarouselItemDirective {
  readonly templateRef = inject<TemplateRef<CarouselItemContext>>(TemplateRef);
}

@Component({
  selector: 'app-carousel',
  imports: [NgTemplateOutlet],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements OnChanges {
  @ContentChild(CarouselItemDirective)
  private readonly itemTemplate?: CarouselItemDirective;

  @Input() items: readonly unknown[] | null = [];
  @Input() visibleItemCount = 1;
  @Input() previousLabel = 'Previous';
  @Input() nextLabel = 'Next';
  @Input() ariaLabelledBy: string | null = null;
  @Input() trackBy: CarouselTrackByFn = (item, index) => item ?? index;

  currentIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] || changes['visibleItemCount']) {
      this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
    }
  }

  get itemTemplateRef(): TemplateRef<CarouselItemContext> | null {
    return this.itemTemplate?.templateRef ?? null;
  }

  get visibleItems(): readonly unknown[] {
    return this.normalizedItems.slice(
      this.currentIndex,
      this.currentIndex + this.normalizedVisibleItemCount,
    );
  }

  get canMovePrevious(): boolean {
    return this.currentIndex > 0;
  }

  get canMoveNext(): boolean {
    return this.currentIndex < this.maxIndex;
  }

  get showControls(): boolean {
    return this.normalizedItems.length > this.normalizedVisibleItemCount;
  }

  get normalizedVisibleItemCount(): number {
    return Math.max(Math.floor(this.visibleItemCount), 1);
  }

  movePrevious(): void {
    this.currentIndex = Math.max(this.currentIndex - 1, 0);
  }

  moveNext(): void {
    this.currentIndex = Math.min(this.currentIndex + 1, this.maxIndex);
  }

  getItemContext(item: unknown, index: number): CarouselItemContext {
    return {
      $implicit: item,
      index: this.currentIndex + index,
    };
  }

  trackItem(index: number, item: unknown): unknown {
    return this.trackBy(item, this.currentIndex + index);
  }

  private get normalizedItems(): readonly unknown[] {
    return this.items ?? [];
  }

  private get maxIndex(): number {
    const maxIndex =
      this.normalizedItems.length - this.normalizedVisibleItemCount;

    return Math.max(maxIndex, 0);
  }
}
