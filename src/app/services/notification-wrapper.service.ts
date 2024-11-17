import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { NotificationsService, Notification } from '../api';

@Injectable({
  providedIn: 'root'
})
export class NotificationWrapperService {

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  constructor(private notificationsService: NotificationsService) {}

  fetchNotificationsForUser(): void {
    this.notificationsService.getNotificationsForUser().subscribe({
      next: async (response: any) => {
        let notifications;

        if (response instanceof Blob) {
          const text = await response.text();
          const jsonResponse = JSON.parse(text);
          notifications = jsonResponse || [];
        } else {
          notifications = response || [];
        }

        this.notificationsSubject.next(notifications);
      },
      error: (error) => {
        console.error('Error fetching notifications:', error);
      }
    });
  }

  markNotificationAsRead(id: number): Observable<object> {
    return this.notificationsService.markAsRead(id).pipe(
      tap(() => this.fetchNotificationsForUser())
    );
  }
}
