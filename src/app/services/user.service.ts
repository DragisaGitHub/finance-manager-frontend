import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Role } from '../models/role.model';
import { KeycloakTokenParsed } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private keycloakService: KeycloakService) {}

  getCurrentUserProfile() {
    const token: KeycloakTokenParsed | undefined = this.keycloakService.getKeycloakInstance().tokenParsed;
    return {
      username: token?.['preferred_username'] || '',
      email: token?.['email'] || '',
      roles: (token?.realm_access?.roles || []) as Role[]
    };
  }
}
