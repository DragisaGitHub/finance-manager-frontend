import { Component } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [MatCardModule, MatCardHeader, MatCardContent, MatCardActions, MatButton],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }
}
