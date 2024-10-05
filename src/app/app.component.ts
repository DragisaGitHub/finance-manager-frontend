import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'finance-manager-frontend';

  constructor(private keycloakService: KeycloakService) {}

  logout() {
    this.keycloakService.logout(window.location.origin);
  }
}
