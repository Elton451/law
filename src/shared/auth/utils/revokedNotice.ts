// Survives the sign-out redirect so the login page can say why it happened (US26).
const KEY = 'novelo:session-revoked';

export const rememberRevokedSession = () => {
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    // Storage unavailable: the person still lands on the login page.
  }
};

/** Whether this device was signed out by the device limit; clears the flag. */
export const takeRevokedSessionNotice = () => {
  try {
    const revoked = sessionStorage.getItem(KEY) === '1';
    sessionStorage.removeItem(KEY);
    return revoked;
  } catch {
    return false;
  }
};
