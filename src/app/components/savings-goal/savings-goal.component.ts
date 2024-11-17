import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output, TrackByFunction,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CurrencyPipe, DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCheckbox } from '@angular/material/checkbox';
import { CustomDataPickerComponent } from '../custom-data-picker/custom-data-picker.component';
import { UserService } from '../../services/user.service';
import { Notification, NotificationsService, SavingsGoal, SavingsGoalsService } from '../../api';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-savings-goal',
  templateUrl: './savings-goal.component.html',
  styleUrls: ['./savings-goal.component.scss'],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    DatePipe,
    NgForOf,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgIf,
    MatIconModule,
    CurrencyPipe,
    MatIconButton,
    MatProgressBar,
    DecimalPipe,
    MatCheckbox,
  ],
})
export class SavingsGoalComponent implements OnInit {
  readonly customDataPicker = CustomDataPickerComponent;

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);

  newGoal: SavingsGoal = {
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: '',
    completed: false,
  };

  goals: SavingsGoal[] = [];
  filteredGoals: SavingsGoal[] = [];
  showAchievedGoals = true;
  notifications: Notification[] = [];

  // Temporary storage for additional amounts for each goal
  additionalAmounts: { [goalId: number]: number } = {};

  @Output() goalAdded = new EventEmitter<void>();
  trackById(index: number, goal: SavingsGoal): number {
    return goal.id!;
  }

  constructor(
    private savingsGoalService: SavingsGoalsService,
    private notificationService: NotificationsService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  toggleShowAchievedGoals(): void {
    this.filterGoals();
  }

  filterGoals(): void {
    this.filteredGoals = this.showAchievedGoals
      ? this.goals
      : this.goals.filter(goal => !goal.completed);

    this.cdr.markForCheck();
  }

  addOrUpdateGoal(): void {
    if (this.newGoal.targetDate) {
      this.newGoal.targetDate = this.datePipe.transform(this.newGoal.targetDate, 'yyyy-MM-dd') as string;
    }

    this.savingsGoalService.createOrUpdateGoal(this.newGoal).subscribe({
      next: () => {
        this.loadGoals();
        this.resetForm();
      },
      error: (error) => console.error('Error saving goal:', error)
    });
  }

  clearTargetAmountIfZero(): void {
    if (this.newGoal.targetAmount === 0) this.newGoal.targetAmount = 0;
  }

  clearCurrentAmountIfZero(): void {
    if (this.newGoal.currentAmount === 0) this.newGoal.currentAmount = 0;
  }

  resetForm(): void {
    this.newGoal = {
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: '',
      completed: false,
    };
  }

  loadGoals(): void {
    this.savingsGoalService.getUserSavingsGoals().subscribe({
      next: async (response: any) => {
        if (response instanceof Blob) {
          const text = await response.text();
          const jsonResponse = JSON.parse(text);
          this.goals = jsonResponse._embedded?.savingsGoalList || [];
        } else {
          this.goals = response._embedded?.savingsGoalList || [];
        }

        this.filterGoals();
        this.checkForAlerts();
      },
      error: (error) => console.error('Error loading savings goals:', error)
    });
  }

  deleteGoal(id: number | null | undefined): void {
    if (id) {
      this.savingsGoalService.deleteSavingsGoal(id).subscribe({
        next: () => this.loadGoals(),
        error: (error) => console.error('Error deleting goal:', error)
      });
    } else {
      console.error('Goal ID is invalid, cannot delete.');
    }
  }

  checkForAlerts(): void {
    this.notificationService.getNotificationsForUser().subscribe({
      next: async (response: any) => {
        let notifications: Notification[];

        if (response instanceof Blob) {
          const text = await response.text();
          notifications = JSON.parse(text);
        } else {
          notifications = response;
        }

        this.notifications = notifications;
        this.cdr.markForCheck();
      },
      error: (error) => console.error('Error fetching notifications:', error)
    });
  }

  addToGoal(goal: SavingsGoal): void {
    const additionalAmount = this.additionalAmounts[goal.id || 0] || 0;

    if (additionalAmount <= 0) {
      alert('Please enter a valid amount to add.');
      return;
    }

    if (goal.id) {
      this.savingsGoalService.addToGoal(goal.id, additionalAmount).subscribe({
        next: () => {
          this.loadGoals();
          if (goal.id) {
            this.additionalAmounts[goal.id] = 0;
          }
          this.refreshNotifications();
        },
        error: (error) => console.error('Error updating goal:', error),
      });
    }
  }

  refreshNotifications(): void {
    this.notificationService.getNotificationsForUser().subscribe((notifications) => {
      this.notificationsSubject.next(notifications);
    });
  }
}
