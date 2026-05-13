import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';

export const routes: Routes = [
    { path: "", component: MainLayoutComponent, children: [
        { path: "", component: HomeComponent }
    ]},

    { path: "login", component: AuthLayoutComponent, children: [
        { path: "", component: LoginComponent }
    ]},
    
    { path: "**", redirectTo: "login" },
];
