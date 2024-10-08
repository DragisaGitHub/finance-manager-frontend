import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';

export function initializeKeycloak(keycloak: KeycloakService, router: Router) {
  return () =>
    keycloak
      .init({
        config: {
          url: 'http://localhost:9090',
          realm: 'finance_management',
          clientId: 'finance-management',
        },
        bearerPrefix: 'Bearer',
        initOptions: {
          onLoad: 'login-required',
          silentCheckSsoRedirectUri:
            window.location.origin + '/public/silent-check-sso.html',
        },
        shouldAddToken: (request) => {
          const { method, url } = request;

          const isGetRequest = 'GET' === method.toUpperCase();
          const acceptablePaths = ['/public', '/api/public'];
          const isAcceptablePathMatch = acceptablePaths.some((path) =>
            url.includes(path)
          );

          return !(isGetRequest && isAcceptablePathMatch);
        },
      })
      .catch((error) => {
        console.error('Keycloak initialization failed:', error);
        router.navigate(['/error']); // Redirect to error page
      });
}
