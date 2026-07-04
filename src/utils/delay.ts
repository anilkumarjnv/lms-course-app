/**
 * Network simulation helpers for the mock service layer.
 *
 * Every service call is routed through `simulateNetwork` so the UI exercises
 * real loading, success, and error states — the same paths a live API would
 * drive. Timing and failure behaviour are controlled by the mutable
 * `networkConfig` object, which can be tuned at runtime (e.g. to force error
 * states for a demo, or to speed up tests).
 */

/** Error thrown when a simulated request "fails". */
export class NetworkError extends Error {
  constructor(message = 'Simulated network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export interface NetworkConfig {
  /** Probability in [0..1] that any given request rejects. */
  failureRate: number;
  /** Minimum artificial latency in ms. */
  minDelayMs: number;
  /** Maximum artificial latency in ms. */
  maxDelayMs: number;
}

/**
 * Runtime-tunable network behaviour. Mutate these fields to change how the mock
 * service behaves without touching call sites:
 *   networkConfig.failureRate = 1; // force every request to fail
 */
export const networkConfig: NetworkConfig = {
  failureRate: 0,
  minDelayMs: 500,
  maxDelayMs: 1200,
};

/** Resolve after `ms` milliseconds. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Wrap a value in a simulated network round-trip.
 *
 * @param data     The payload to resolve with on success.
 * @param options  Optional per-call overrides for latency/failure.
 * @returns        A promise that resolves with `data` after a random delay, or
 *                 rejects with a {@link NetworkError} based on `failureRate`.
 */
export async function simulateNetwork<T>(
  data: T,
  options?: Partial<NetworkConfig>,
): Promise<T> {
  const failureRate = options?.failureRate ?? networkConfig.failureRate;
  const minDelayMs = options?.minDelayMs ?? networkConfig.minDelayMs;
  const maxDelayMs = options?.maxDelayMs ?? networkConfig.maxDelayMs;

  await delay(randomBetween(minDelayMs, maxDelayMs));

  if (Math.random() < failureRate) {
    throw new NetworkError();
  }

  return data;
}
