import { inject } from '@angular/core';
import { Router } from '@angular/router';

function isJwtExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return typeof payload.exp === 'number' && Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (!token || isJwtExpired(token)) {
    localStorage.removeItem('authToken');
    router.navigate(['/login']);
    return false;
  }

  return true;
};