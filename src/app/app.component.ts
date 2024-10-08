import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import {KeycloakService} from "keycloak-angular";
import { NgIf } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'finance-manager-frontend';
  showNavbar: boolean = true;

  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = event.url !== '/';
      }
    });
  }

  logout() {
    this.keycloakService.logout(window.location.origin);
  }
}
