import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingStarClass',
})
export class RatingStarClassPipe implements PipeTransform {
  transform(
    position: number,
    reviewRating: number | null | undefined,
  ): string {
    const rating =
      Math.round(Math.min(Math.max(reviewRating ?? 0, 0), 5) * 2) / 2;

    if (rating >= position) {
      return 'bi-star-fill product__rating-star--colored';
    }

    if (rating >= position - 0.5) {
      return 'bi-star-half product__rating-star--colored';
    }

    return 'bi-star';
  }
}
