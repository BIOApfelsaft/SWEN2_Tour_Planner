import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  layoutService = inject(LayoutService);

  navItems = [
    { path: '/', icon: 'dashboard', label: 'Dashboard' },
    { path: '/tour-planner', icon: 'explore', label: 'Tour Planner' },
    { path: '/activity-log', icon: 'history_edu', label: 'My Logs' },
    { path: '/profile', icon: 'person', label: 'Profile' },
  ];
}