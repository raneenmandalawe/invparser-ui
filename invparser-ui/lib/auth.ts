/**
 * Authentication utilities
 */

export const setAuth = (isAuthenticated: boolean) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth', isAuthenticated ? 'true' : 'false');
  }
};

export const getAuth = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('auth') === 'true';
};

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth');
  }
};

export const isAuthenticated = (): boolean => {
  return getAuth();
};
