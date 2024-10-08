import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { SavingsGoalService } from '../../services/savings-goal.service';
import { SavingsGoal } from '../../models/savings-goal.model';
import { MatButton } from '@angular/material/button';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
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
import { CustomDataPickerComponent } from '../custom-data-picker/custom-data-picker.component';
import { MatIconModule } from '@angular/material/icon';

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
  ],
})
export class SavingsGoalComponent implements OnInit {
  readonly customDataPicker = CustomDataPickerComponent;
  newGoal: SavingsGoal = {
    name: '',
    targetAmount: null,
    currentAmount: null,
    targetDate: '',
    completed: false,
  };

  goals: SavingsGoal[] = [];
  alertMessage: string | null = null;
  @Output() goalAdded = new EventEmitter<unknown>();

  constructor(private savingsGoalService: SavingsGoalService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  addOrUpdateGoal(): void {
    this.savingsGoalService.createOrUpdateGoal(this.newGoal).subscribe(() => {
      this.loadGoals();
      this.resetForm();
    });
  }

  deleteGoal(id: number | null | undefined): void {
    if (id != null) {
      this.savingsGoalService.deleteGoal(id).subscribe(() => {
        this.loadGoals();
      });
    } else {
      console.error('Goal ID is invalid, cannot delete.');
    }
  }

  loadGoals(): void {
    this.savingsGoalService.getUserSavingsGoals().subscribe((response: any) => {
      console.log('Response from API:', response); // Debugging

      if (response._embedded && response._embedded.savingsGoalList) {
        this.goals = response._embedded.savingsGoalList;
        console.log('Goals loaded:', this.goals); // Debugging
      } else {
        this.goals = [];
      }

      this.cdr.markForCheck(); // Trigger change detection manually with OnPush strategy
      this.checkForAlerts(); // Check alerts after loading goals
    });
  }

  checkForAlerts(): void {
    this.alertMessage = null; // Reset the alert message before checking

    for (const goal of this.goals) {
      // Ensure currentAmount and targetAmount are not null or undefined
      const currentAmount = goal.currentAmount ?? 0; // Default to 0 if null or undefined
      const targetAmount = goal.targetAmount ?? 1; // Avoid division by zero, default to 1 if null or undefined

      const progress = (currentAmount / targetAmount) * 100;

      if (progress >= 90 && progress < 100) {
        this.alertMessage = `You are close to reaching your savings goal for ${goal.name}!`;
      } else if (progress >= 100) {
        this.alertMessage = `Congratulations! You've reached your savings goal for ${goal.name}!`;
      } else if (currentAmount < 0) {
        this.alertMessage = `Warning! You've overspent your goal for ${goal.name}!`;
      }
    }
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
}
