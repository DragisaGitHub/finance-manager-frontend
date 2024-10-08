import { Component, OnInit } from '@angular/core';
import { SavingsGoalService } from '../../services/savings-goal.service';
import { SavingsGoal } from '../../models/savings-goal.model';
import { MatButton } from '@angular/material/button';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-savings-goal',
  templateUrl: './savings-goal.component.html',
  styleUrls: ['./savings-goal.component.scss'],
  standalone: true,
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
    NgIf,
  ],
})
export class SavingsGoalComponent implements OnInit {
  newGoal: SavingsGoal = {
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: '',
    completed: false,
  };

  goals: any[] = [];
  alertMessage: string | null = null;

  constructor(private savingsGoalService: SavingsGoalService) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.savingsGoalService.getUserSavingsGoals().subscribe((goals: any[]) => {
      this.goals = goals;
    });
  }

  addOrUpdateGoal(): void {
    this.savingsGoalService.createOrUpdateGoal(this.newGoal).subscribe(() => {
      this.loadGoals();
      this.newGoal = {
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        targetDate: '',
        completed: false,
      };
    });
  }

  deleteGoal(id: number): void {
    this.savingsGoalService.deleteGoal(id).subscribe(() => {
      this.loadGoals();
    });
  }

  checkForAlerts(): void {
    for (const goal of this.goals) {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      if (progress >= 90 && progress < 100) {
        this.alertMessage = `You are close to reaching your savings goal for ${goal.name}!`;
      } else if (progress >= 100) {
        this.alertMessage = `Congratulations! You've reached your savings goal for ${goal.name}!`;
      } else if (goal.currentAmount < 0) {
        this.alertMessage = `Warning! You've overspent your goal for ${goal.name}!`;
      }
    }
  }
}
