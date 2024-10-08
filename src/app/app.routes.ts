import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ErrorPageComponent } from './components/error-page/error-page.component'; // Import the error page
import { keycloakGuard } from './auth/keycloak.guard';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home is accessible to all
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [keycloakGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'add-transaction',
    component: AddTransactionComponent,
    canActivate: [keycloakGuard],
  },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', redirectTo: 'error' },
];
