import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { SavingsGoalService } from '../../services/savings-goal.service';
import { SavingsGoal } from '../../models/savings-goal.model';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CurrencyPipe, DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatFormField,
  MatFormFieldModule,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NotificationService } from '../../services/notification.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { Notification } from '../../models/notification.model';
import { CustomDataPickerComponent } from '../custom-data-picker/custom-data-picker.component';
import { UserService } from '../../services/user.service';

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
    MatFormField,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatLabel,
    MatNativeDateModule,
    MatHint,
    NgIf,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    CurrencyPipe,
    MatIconButton,
    MatProgressBar,
    DecimalPipe,
    MatCheckbox,
  ],
})
export class SavingsGoalComponent implements OnInit {
  readonly customDataPicker = CustomDataPickerComponent;
  newGoal: SavingsGoal = {
    name: '',
    targetAmount: null,
    currentAmount: null,
    additionalAmount: null,
    targetDate: '',
    completed: false,
  };

  goals: SavingsGoal[] = [];
  filteredGoals: SavingsGoal[] = [];
  showAchievedGoals = true;  // Default is to show achieved goals
  notifications: Notification[] = [];

  @Output() goalAdded = new EventEmitter<unknown>();

  constructor(
    private savingsGoalService: SavingsGoalService,
    private notificationService: NotificationService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  // This method toggles the display of achieved goals
  toggleShowAchievedGoals(): void {
    this.filterGoals();
  }

  // Filters the goals based on the checkbox value
  filterGoals(): void {
    console.log('this.showAchievedGoals', this.showAchievedGoals);

    this.goals.forEach(goal => {
      console.log(`Goal: ${goal.name}, Completed: ${goal.completed}`);
    });

    if (this.showAchievedGoals) {
      this.filteredGoals = this.goals;
    } else {
      this.filteredGoals = this.goals.filter(goal => !goal.completed);
    }

    console.log('filteredGoals', this.filteredGoals);

    this.cdr.markForCheck(); // Ensure the UI updates
  }

  // Save or update goal logic
  addOrUpdateGoal(): void {
    if (this.newGoal.targetDate) {
      this.newGoal.targetDate = this.datePipe.transform(
        this.newGoal.targetDate,
        'yyyy-MM-dd',
      ) as string;
    }

    this.savingsGoalService.createOrUpdateGoal(this.newGoal).subscribe(() => {
      this.loadGoals();
      this.resetForm();
    });
  }

  // Clear out current and target amounts if they are zero
  clearTargetAmountIfZero(): void {
    if (this.newGoal.targetAmount === 0) {
      this.newGoal.targetAmount = null;
    }
  }

  clearCurrentAmountIfZero(): void {
    if (this.newGoal.currentAmount === 0) {
      this.newGoal.currentAmount = null;
    }
  }

  // Reset the form after saving a goal
  resetForm(): void {
    this.newGoal = {
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      additionalAmount: 0,
      targetDate: '',
      completed: false,
    };
  }

  // Load all the goals from the backend
  loadGoals(): void {
    this.savingsGoalService.getUserSavingsGoals().subscribe((response: any) => {
      if (response._embedded && response._embedded.savingsGoalList) {
        this.goals = response._embedded.savingsGoalList;
      } else {
        this.goals = [];
      }
      this.filterGoals(); // Filter goals based on checkbox
      this.cdr.markForCheck();
      this.checkForAlerts(); // Check for any notifications or alerts
    });
  }

  // Method to delete a goal
  deleteGoal(id: number | null | undefined): void {
    if (id != null) {
      this.savingsGoalService.deleteGoal(id).subscribe(() => {
        this.loadGoals();
      });
    } else {
      console.error('Goal ID is invalid, cannot delete.');
    }
  }

  // Check progress and generate notifications if necessary
  // checkForAlerts(): void {
  //   for (const goal of this.goals) {
  //     const currentAmount = goal.currentAmount ?? 0;
  //     const targetAmount = goal.targetAmount ?? 1;
  //     const progress = (currentAmount / targetAmount) * 100;
  //
  //     let message = '';
  //     if (progress >= 90 && progress < 100) {
  //       message = `You are close to reaching your savings goal for ${goal.name}!`;
  //     } else if (progress >= 100) {
  //       message = `Congratulations! You've reached your savings goal for ${goal.name}!`;
  //     } else if (currentAmount < 0) {
  //       message = `Warning! You've overspent your goal for ${goal.name}!`;
  //     }
  //
  //     if (message) {
  //       const notification: Notification = {
  //         id: Date.now(), // Unique identifier
  //         username: 'current_user', // Use actual username
  //         message,
  //         isRead: false,
  //       };
  //       this.notifications.push(notification); // Add to notifications
  //     }
  //   }
  //   this.cdr.markForCheck();
  // }

  checkForAlerts(): void {
    // Clear the current notifications
    this.notifications = [];
    this.notificationService.getUnreadNotifications().subscribe((response: Notification[]) => {
      this.notifications = response;
      this.cdr.markForCheck();
    }, error => {
      console.error('Error fetching notifications:', error);
    });
  }

  // Method to add additional amount to the goal
  addToGoal(goal: SavingsGoal): void {
    const additionalAmount = goal.additionalAmount || 0;

    if (additionalAmount <= 0) {
      alert('Please enter a valid amount to add.');
      return;
    }

    if (goal.id) {
      this.savingsGoalService.addToGoal(goal.id, additionalAmount).subscribe({
        next: () => {
          this.loadGoals();
          goal.additionalAmount = 0; // Clear the input
          this.notificationService.refreshNotifications(); // Refresh notifications if needed
        },
        error: (error) => {
          console.error('Error updating goal:', error);
        },
      });
    }
  }
}
