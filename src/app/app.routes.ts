import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import {keycloakGuard} from "./auth/keycloak.guard";

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home is accessible to all
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [keycloakGuard], // Protect with Keycloak
    data: { roles: ['admin'] } // Only admin role
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [keycloakGuard], // Protect with Keycloak
    data: { roles: ['user'] } // Only regular user role
  },
  { path: '**', redirectTo: '' } // Fallback route
];
