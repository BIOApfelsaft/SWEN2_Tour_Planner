import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // Global Signal for mobile menu state
  isMobileMenuOpen = signal<boolean>(false);

  toggleMenu() {
    this.isMobileMenuOpen.update(state => !state);
  }

  closeMenu() {
    this.isMobileMenuOpen.set(false);
  }
}