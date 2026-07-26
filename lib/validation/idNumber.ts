/**
 * Ported from src/shared/utils/idValidation.js so the client-side pre-check
 * on /apply (TAD §11.5) rejects/accepts exactly what the server will. Keep
 * this in sync if the backend util changes, it is not authoritative, the
 * server always re-validates.
 */

function luhnCheck(digits: string): boolean {
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function isPlausibleYyMmDd(yymmdd: string): boolean {
  const month = Number(yymmdd.slice(2, 4));
  const day = Number(yymmdd.slice(4, 6));
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  return true;
}

export function validateSaId(value: string): { valid: boolean; message?: string } {
  if (!/^\d{13}$/.test(value)) {
    return { valid: false, message: 'SA ID number must be 13 digits.' };
  }
  if (!isPlausibleYyMmDd(value)) {
    return { valid: false, message: 'SA ID number contains an invalid date of birth.' };
  }
  if (!luhnCheck(value)) {
    return { valid: false, message: 'SA ID number failed the checksum check.' };
  }
  return { valid: true };
}

export function validatePassport(value: string): { valid: boolean; message?: string } {
  if (!/^[A-Za-z0-9]{5,15}$/.test(value)) {
    return { valid: false, message: 'Passport number must be 5 to 15 letters or digits.' };
  }
  return { valid: true };
}

export function validateIdNumber(idType: 'sa_id' | 'passport', value: string): { valid: boolean; message?: string } {
  return idType === 'sa_id' ? validateSaId(value) : validatePassport(value);
}
