import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { inject } from '@angular/core';

export const keycloakGuard: CanActivateFn = async (route, state) => {
  const keycloak: KeycloakService = inject(KeycloakService);
  const router: Router = inject(Router);

  const isLoggedIn = keycloak.isLoggedIn(); // Await the Promise

  if (!isLoggedIn) {
    await keycloak.login({ redirectUri: window.location.origin + state.url });
    return false;
  }

  const requiredRoles = route.data?.['roles'];

  if (requiredRoles) {
    const userRoles = keycloak.getUserRoles();
    const hasRole = requiredRoles.some((role: string) => userRoles.includes(role));

    if (!hasRole) {
      await router.navigate(['/']); // Redirect to home if user lacks the role
      return false;
    }
  }

  return true; // Allow access if logged in and has the required role
};
