import { describe, expect, it } from 'vitest';
import { createBidSchema } from './bid-schema';

describe('createBidSchema', () => {
  it('rejects a price of 0 or below', () => {
    const schema = createBidSchema({});
    expect(schema.safeParse({ price: 0 }).success).toBe(false);
    expect(schema.safeParse({ price: -10 }).success).toBe(false);
  });

  it('accepts any positive price when no constraints are given', () => {
    const schema = createBidSchema({});
    expect(schema.safeParse({ price: 12345 }).success).toBe(true);
  });

  it('rejects a price below the configured minimum', () => {
    const schema = createBidSchema({ min: 1000 });
    expect(schema.safeParse({ price: 500 }).success).toBe(false);
  });

  it('rejects a price above the configured maximum', () => {
    const schema = createBidSchema({ max: 5000 });
    expect(schema.safeParse({ price: 6000 }).success).toBe(false);
  });

  it('accepts a price that lands exactly on a step boundary from min', () => {
    const schema = createBidSchema({ min: 1000, step: 100 });
    expect(schema.safeParse({ price: 1300 }).success).toBe(true);
  });

  it('rejects a price that does not land on a step boundary', () => {
    const schema = createBidSchema({ min: 1000, step: 100 });
    const result = schema.safeParse({ price: 1350 });
    expect(result.success).toBe(false);
  });

  it('coerces a numeric string from a form input', () => {
    const schema = createBidSchema({});
    const result = schema.safeParse({ price: '2500' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(2500);
    }
  });
});
