import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { TourDetailComponent } from './features/tour-details/tour-detail.component';
import { TourPlannerComponent } from './features/tour-planner/tour-planner.component';
import { ActivityLogComponent } from './features/activity-log/activity-log.component';
import { UserProfileComponent } from './features/user-profile/user-profile.component';
import { ImportExportComponent } from './features/import-export/import-export.component';

export const routes: Routes = [
    { path: "login", component: AuthLayoutComponent, children: [
        { path: "", component: LoginComponent }
    ]},

    { path: "", component: MainLayoutComponent, children: [
        { path: "", component: DashboardComponent, canActivate: [authGuard] }
    ]},

    { path: "tour-planner", component: MainLayoutComponent, children: [
        { path: "", component: TourPlannerComponent, canActivate: [authGuard] }
    ]},

    { path: "tour-planner/:id", component: MainLayoutComponent, children: [
        { path: "", component: TourPlannerComponent, canActivate: [authGuard] }
    ]},
    
    { path: "tour/:id", component: MainLayoutComponent, children: [
        { path: "", component: TourDetailComponent, canActivate: [authGuard] }
    ]},

    { path: "activity-log", component: MainLayoutComponent, children: [
        { path: "", component: ActivityLogComponent, canActivate: [authGuard] }
    ]},

    { path: "profile", component: MainLayoutComponent, children: [
        { path: "", component: UserProfileComponent, canActivate: [authGuard] }
    ]},

    { path: "data-management", component: MainLayoutComponent, children: [
        { path: "", component:ImportExportComponent, canActivate: [authGuard] }
    ]},

    { path: "**", redirectTo: "login" },
];
