import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  navItems = [
    { path: '/', icon: 'dashboard', label: 'Dashboard' },
    { path: '/tour-planner', icon: 'explore', label: 'Tour Planner' },
    { path: '/logs', icon: 'history_edu', label: 'My Logs' },
    { path: '/statistics', icon: 'analytics', label: 'Statistics' },
    { path: '/settings', icon: 'settings', label: 'Settings' }
  ];
}