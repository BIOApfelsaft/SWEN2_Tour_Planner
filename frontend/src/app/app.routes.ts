import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { TourDetailComponent } from './features/tour-details/tour-detail.component';
import { TourPlannerComponent } from './features/tour-planner/tour-planner.component';
import { ActivityLogComponent } from './features/activity-log/activity-log.component';

export const routes: Routes = [
    { path: "", component: MainLayoutComponent, children: [
        { path: "", component: DashboardComponent }
    ]},

    { path: "login", component: AuthLayoutComponent, children: [
        { path: "", component: LoginComponent }
    ]},

    { path: "tour-planner", component: MainLayoutComponent, children: [
        { path: "", component: TourPlannerComponent }
    ]},

    { path: "tour-planner/:id", component: MainLayoutComponent, children: [
        { path: "", component: TourPlannerComponent }
    ]},
    
    { path: "tour/:id", component: MainLayoutComponent, children: [
        { path: "", component: TourDetailComponent }
    ]},

    { path: "activity-log", component: MainLayoutComponent, children: [
        { path: "", component: ActivityLogComponent }
    ]},

    { path: "**", redirectTo: "login" },
];
