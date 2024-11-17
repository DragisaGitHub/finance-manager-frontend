import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakTokenParsed } from 'keycloak-js';
import { Role } from '../api/model/role';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private keycloakService: KeycloakService) {}

  private getCurrentUserProfile() {
    const token: KeycloakTokenParsed | undefined =
      this.keycloakService.getKeycloakInstance().tokenParsed;
    return {
      username: token?.['preferred_username'] || '',
      email: token?.['email'] || '',
      roles: (token?.realm_access?.roles || []) as Role[],
    };
  }

  private isUserInRole(roleToCheck: Role): boolean {
    const currentUser = this.getCurrentUserProfile();
    return currentUser.roles
      .map((role) => role.toUpperCase())
      .includes(roleToCheck.toUpperCase());
  }

  isAdmin(): boolean {
    return this.isUserInRole(Role.ADMIN);
  }

  getUsername(): string {
    return this.getCurrentUserProfile().username;
  }

  redirectToKeycloakRegistration(): Promise<void> {
    return this.keycloakService.login();
  }

  logout() {
    this.keycloakService.logout();
  }
}
