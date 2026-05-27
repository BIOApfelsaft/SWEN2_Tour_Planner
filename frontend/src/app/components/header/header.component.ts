import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    imports: [],
    template: `
        <header class="bg-on-primary-container border-b shadow-sm flex justify-between items-center w-full px-6 py-3 z-40 top-0">
    
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
                
                <button class="text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors p-2 rounded-full active:scale-95 duration-150 flex items-center justify-center">
                <span class="material-symbols-outlined">account_circle</span>
                </button>

                <button class="bg-primary text-on-primary px-4 py-2 rounded-lg font-title-sm text-title-sm hover:bg-surface-tint transition-colors active:scale-95 duration-150 shadow-[0_4px_16px_rgba(84,95,114,0.08)] md:block">
                    New Tour
                </button>

            </div>
        </header>
    `,
})
export class HeaderComponent {}
