import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterLink, NgIf],
})
export class NavbarComponent implements OnInit {
  isAdmin: boolean = false; // Track if the user is an admin

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.isAdmin = this.userService.isAdmin();
  }

  logout() {
    this.userService.logout();
  }
}
