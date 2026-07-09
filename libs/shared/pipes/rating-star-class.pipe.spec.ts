import { RatingStarClassPipe } from './rating-star-class.pipe';

describe('RatingStarClassPipe', () => {
  const pipe = new RatingStarClassPipe();

  it('returns filled, half-filled, and empty star classes', () => {
    expect(pipe.transform(3, 3.5)).toBe(
      'bi-star-fill product__rating-star--colored',
    );
    expect(pipe.transform(4, 3.5)).toBe(
      'bi-star-half product__rating-star--colored',
    );
    expect(pipe.transform(5, 3.5)).toBe('bi-star');
  });

  it('clamps ratings to the five-star range', () => {
    expect(pipe.transform(1, -1)).toBe('bi-star');
    expect(pipe.transform(5, 6)).toBe(
      'bi-star-fill product__rating-star--colored',
    );
  });
});
