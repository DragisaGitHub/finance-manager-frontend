// src/app/components/notification/notification.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Notification } from '../../api';
import { NotificationWrapperService } from '../../services/notification-wrapper.service';

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
    private notificationService: NotificationWrapperService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.userService.getUsername();
    this.notificationService.notifications$.subscribe((notifications: Notification[]) => {

      this.notifications = notifications.filter(
        (notification): notification is Notification & { username: string } =>
          notification.username === this.currentUsername
      );
      this.isLoading = false;
    });

    this.notificationService.fetchNotificationsForUser();
  }

  onNotificationClick(notification: Notification): void {
    this.markAsRead(notification);
  }

  markAsRead(notification: Notification): void {
    if (notification.id !== undefined) {
      this.notificationService.markNotificationAsRead(notification.id).subscribe({
        next: () => {
          this.notificationService.fetchNotificationsForUser();
        },
        error: (error: any) => {
          console.error('Error marking notification as read', error);
        },
      });
    } else {
      console.error('Notification ID is undefined, cannot mark as read');
    }
  }

}
