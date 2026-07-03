import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../api/models/user-response';
import { ButtonComponent } from '../button/button.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ButtonComponent, SearchBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="bg-on-primary-container border-b shadow-sm flex justify-between items-center w-full px-6 py-3 sticky top-0 z-[40000]"
    >
      <button
        (click)="layoutService.toggleMenu()"
        class="md:hidden p-2 text-on-surface hover:bg-surface-container rounded-lg transition-colors"
      >
        <span class="material-symbols-outlined">menu</span>
      </button>
      
      <div class="flex items-center">
        <span
          class="material-symbols-outlined text-primary text-2xl mr-2"
          style="font-variation-settings: 'FILL' 1;"
          >explore</span
        >
        <span class="font-title-sm text-title-sm text-primary tracking-tight">Pathfinder</span>
      </div>

      <div class="flex items-center gap-2 md:gap-4">
        @if (user(); as currentUser) {
          <!-- ADDED: Explicit widths (w-64 lg:w-96) to prevent the search bar from collapsing -->
          <div class="hidden md:block relative w-64 lg:w-96">
            <app-search-bar></app-search-bar>
          </div>
          
          <a
            routerLink="/profile"
            class="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden hover:border-primary transition-colors cursor-pointer shrink-0 flex items-center justify-center bg-white/5"
            aria-label="Open profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
              />
            </svg>
          </a>
        }

        @if (user()) {
          <!-- ADDED: 'shrink-0' to buttons to ensure they never get squished by the flex container -->
          <app-button (click)="authService.logout()" variant="secondary" class="shrink-0"> Logout </app-button>
        }

        <app-button [routerLink]="['/tour-planner']" variant="primary" class="shrink-0"> New Tour </app-button>
      </div>
    </header>
  `,
})
export class HeaderComponent implements OnInit {
  layoutService = inject(LayoutService);
  userService = inject(UserService);
  authService = inject(AuthService);
  user = signal<UserResponse | null>(null);

  ngOnInit() {
    this.userService.getCurrentUser().then((u) => this.user.set(u));
  }
}