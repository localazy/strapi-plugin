import { delay } from '../delay';

describe('delay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay execution by default time (150ms)', () => {
    const promise = delay();
    jest.advanceTimersByTime(150);
    expect(promise).resolves.toBeUndefined();
  });

  it('should delay execution by specified time', () => {
    const promise = delay(500);
    jest.advanceTimersByTime(500);
    expect(promise).resolves.toBeUndefined();
  });

  it('should not resolve before the delay time', () => {
    const promise = delay(1000);
    jest.advanceTimersByTime(500);
    expect(promise).not.toBe(undefined);
  });
});
