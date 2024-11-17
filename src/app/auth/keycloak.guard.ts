import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { inject } from '@angular/core';

export const keycloakGuard: CanActivateFn = async (route, state) => {
  const keycloak: KeycloakService = inject(KeycloakService);
  const router: Router = inject(Router);

  let authenticated = keycloak.isTokenExpired();
  if (authenticated) {
    await keycloak.login({
      redirectUri: window.location.origin + state.url,
    });
  }

  const requiredRoles = route.data?.['roles'];

  if (requiredRoles) {
    const userRoles = keycloak.getUserRoles();
    const hasRole = requiredRoles.some((role: string) => userRoles.includes(role));

    if (!hasRole) {
      await router.navigate(['/']);
      return false;
    }
  }

  return true;
};
