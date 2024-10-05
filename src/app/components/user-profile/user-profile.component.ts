import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NgForOf, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Loading spinner
import { MatCard, MatCardContent } from '@angular/material/card'; // Notification for feedback

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgForOf,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userForm!: FormGroup;
  loading: boolean = true;
  error: string | null = null;

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserProfile();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      username: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      roles: [{ value: [], disabled: true }]
    });
  }

  private loadUserProfile(): void {
    try {
      const profile = this.userService.getCurrentUserProfile();
      this.userForm.patchValue({
        username: profile.username,
        email: profile.email,
        roles: profile.roles
      });
      this.loading = false;
    } catch (err) {
      this.error = 'Error loading user profile';
      this.loading = false;
    }
  }
}
