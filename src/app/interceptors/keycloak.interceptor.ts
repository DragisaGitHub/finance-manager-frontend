import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const keycloakInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);

  if (keycloak.isLoggedIn()) {
    return from(keycloak.getToken()).pipe(
      switchMap((token: string | null) => {
        if (token) {
          const clonedRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next(clonedRequest);
        } else {
          return next(req);
        }
      })
    );
  } else {
    return next(req);
  }
};
