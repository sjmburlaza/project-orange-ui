import { IconPipe } from './icon-pipe';

describe('IconPipe', () => {
  it('create an instance', () => {
    const pipe = new IconPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns the display icon for monitor products', () => {
    const pipe = new IconPipe();

    expect(pipe.transform('Monitors')).toBe('bi bi-display');
  });
});
