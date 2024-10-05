import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { routes } from './app.routes';
import {initializeKeycloak} from "./keycloak-init.factory";
import {keycloakInterceptor} from "./interceptors/keycloak.interceptor";
import { BrowserAnimationsModule, NoopAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([keycloakInterceptor])),
    provideAnimations(),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    BrowserAnimationsModule,
    CommonModule,
    NoopAnimationsModule,
  ],
};
