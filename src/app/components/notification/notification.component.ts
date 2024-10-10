// src/app/components/notification/notification.component.ts
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';
import { UserService } from '../../services/user.service';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  standalone: true,
  styleUrls: ['./notification.component.scss'],
  imports: [
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    NgIf,
    MatMenu,
    MatProgressSpinner,
    MatMenuItem,
    NgForOf,
  ],
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  isLoading = false;
  currentUsername: string = '';

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.userService.getUsername();
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications.filter(
        (notification) => notification.username === this.currentUsername,
      );
      this.isLoading = false;
    });

    this.notificationService.refreshNotifications();
  }

  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.id).subscribe(
      () => {
        this.notificationService.refreshNotifications(); // Refresh after marking as read
      },
      (error) => {
        console.error('Error marking notification as read', error);
      },
    );
  }
}
