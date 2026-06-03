import { Component, inject, signal, OnInit } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ButtonComponent } from "../button/button.component";
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    imports: [RouterLink, ButtonComponent],
    template: `
        <header class="bg-on-primary-container border-b shadow-sm flex justify-between items-center w-full px-6 py-3 z-40000 top-0">
    
            <button (click)="layoutService.toggleMenu()" class="md:hidden p-2 text-on-surface hover:bg-surface-container rounded-lg transition-colors">
                <span class="material-symbols-outlined">menu</span>
            </button>
            <div class="flex items-center">
                <span class="material-symbols-outlined text-primary text-2xl mr-2" style="font-variation-settings: 'FILL' 1;">explore</span>
                <span class="font-title-sm text-title-sm text-primary tracking-tight">Pathfinder</span>
            </div>

            <div class="flex items-center gap-2 md:gap-4">
                
                <div class="hidden md:flex items-center bg-surface-container-lowest border border-outline-variant rounded-full px-3 py-1.5 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <span class="material-symbols-outlined text-outline text-[18px] mr-2">search</span>
                <input 
                    type="text"
                    placeholder="Search tours..." 
                    class="border-none bg-transparent focus:ring-0 p-0 w-48 font-body-sm text-body-sm text-on-surface outline-none placeholder:text-outline"
                />
                </div>
                
                <div class="flex items-center gap-4">
                    @if (user(); as currentUser) {
                        <a routerLink="/profile" class="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden hover:border-primary transition-colors cursor-pointer block shrink-0">
                            <img [src]="currentUser.avatarUrl" [alt]="currentUser.name" class="w-full h-full object-cover">
                        </a>
                    }
                </div>
                
                @if (user()) {
                    <app-button (click)="authService.logout()" variant="secondary">
                        Logout
                    </app-button>
                }
                
                <app-button [routerLink]="['/tour-planner']" variant="primary">
                    New Tour
                </app-button>
            </div>
        </header>
    `,
})
export class HeaderComponent implements OnInit {
    layoutService = inject(LayoutService);
    userService = inject(UserService);
    authService = inject(AuthService);
    user = signal<User | null>(null);

    ngOnInit() {
        this.userService.getCurrentUser().subscribe(u => this.user.set(u));
    }
}
