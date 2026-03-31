import { delay } from '../delay';

describe('delay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay execution by default time (150ms)', async () => {
    const promise = delay();
    jest.advanceTimersByTime(150);
    await expect(promise).resolves.toBeUndefined();
  });

  it('should delay execution by specified time', async () => {
    const promise = delay(500);
    jest.advanceTimersByTime(500);
    await expect(promise).resolves.toBeUndefined();
  });

  it('should not resolve before the delay time', async () => {
    const promise = delay(1000);
    jest.advanceTimersByTime(500);
    await expect(promise).not.toBe(undefined);
  });
});
