import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isAdmin = this.userService.isAdmin();
    console.log('isAdmin', this.isAdmin);
  }

  createAccount() {
    this.userService.redirectToKeycloakRegistration();
  }
}
