import { describe, it, expect } from 'vitest';
import { validateSaId, validatePassport, validateIdNumber } from '@/lib/validation/idNumber';

// Verified valid via the same Luhn algorithm implemented in idNumber.ts:
// base 800101 (1980-01-01) + 5000 + 0 (citizenship) + 8 (historical gender
// digit) + 6 (computed check digit).
const VALID_SA_ID = '8001015000086';

describe('validateSaId', () => {
  it('accepts a Luhn-valid 13-digit ID', () => {
    expect(validateSaId(VALID_SA_ID)).toEqual({ valid: true });
  });

  it('rejects a value that is not 13 digits', () => {
    const result = validateSaId('12345');
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/13 digits/);
  });

  it('rejects a value containing letters', () => {
    const result = validateSaId('80010150000A6');
    expect(result.valid).toBe(false);
  });

  it('rejects an implausible date of birth (month 13)', () => {
    // Same digit count and check-digit position as VALID_SA_ID, but with an
    // invalid month (13) baked into positions 3-4.
    const result = validateSaId('8013015000086');
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/date of birth/);
  });

  it('rejects a value that fails the Luhn checksum', () => {
    // Same 12 digits as VALID_SA_ID but with the check digit incremented,
    // which must fail the checksum since only one check digit (6) is valid
    // for this base.
    const tampered = VALID_SA_ID.slice(0, 12) + '7';
    const result = validateSaId(tampered);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/checksum/);
  });
});

describe('validatePassport', () => {
  it('accepts a 5-15 character alphanumeric value', () => {
    expect(validatePassport('AB123456')).toEqual({ valid: true });
  });

  it('rejects a value shorter than 5 characters', () => {
    expect(validatePassport('AB12').valid).toBe(false);
  });

  it('rejects a value longer than 15 characters', () => {
    expect(validatePassport('A'.repeat(16)).valid).toBe(false);
  });

  it('rejects a value with symbols', () => {
    expect(validatePassport('AB-123456').valid).toBe(false);
  });
});

describe('validateIdNumber', () => {
  it('dispatches to validateSaId for idType sa_id', () => {
    expect(validateIdNumber('sa_id', VALID_SA_ID)).toEqual({ valid: true });
  });

  it('dispatches to validatePassport for idType passport', () => {
    expect(validateIdNumber('passport', 'AB123456')).toEqual({ valid: true });
  });
});
