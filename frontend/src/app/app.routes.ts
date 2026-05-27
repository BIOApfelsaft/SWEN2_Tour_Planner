import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { TourDetailsComponent } from './features/tour-details.component/tour-details.component';

export const routes: Routes = [
    { path: "", component: MainLayoutComponent, children: [
        { path: "", component: DashboardComponent }
    ]},

    { path: "login", component: AuthLayoutComponent, children: [
        { path: "", component: LoginComponent }
    ]},

    { path: "tour/:id", component: MainLayoutComponent, children: [
        { path: "", component: TourDetailsComponent }
    ]},

    { path: "**", redirectTo: "login" },
];
