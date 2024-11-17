import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { CurrencyPipe, NgForOf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Budget, BudgetsService, CategoriesService, Category } from '../../api';
import { map } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TransactionFilterService } from '../../services/transaction-filter.service';

@Component({
  selector: 'app-budget-management',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    NgForOf,
    MatInput,
    MatButton,
    MatProgressBar,
    MatLabel,
    CurrencyPipe,
  ],
  templateUrl: './budget-management.component.html',
  styleUrls: ['./budget-management.component.scss'],
})
export class BudgetManagementComponent implements OnInit {
  newBudget: Budget = {
    category: undefined,
    amount: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };
  categories: Category[] = [];
  budgets: Budget[] = [];
  progressData: { [key: number]: number } = {};

  constructor(
    private budgetService: BudgetsService,
    private categoryService: CategoriesService,
    private transactionFilterService: TransactionFilterService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBudgets();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().pipe(
      switchMap(async (response: any) => {
        if (response instanceof Blob) {
          const text = await response.text();
          const jsonResponse = JSON.parse(text);
          return jsonResponse._embedded?.categoryList || [];
        } else {
          return response._embedded?.categoryList || [];
        }
      })
    ).subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error) => console.error('Error loading categories:', error),
      complete: () => console.log('Category loading complete')
    });
  }

  loadBudgets(): void {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    this.budgetService.getBudgetsForMonth(year, month).pipe(
      switchMap(async (response: any) => {
        if (response instanceof Blob) {
          const text = await response.text();
          const jsonResponse = JSON.parse(text);
          return jsonResponse._embedded?.budgetList || [];
        } else {
          return response._embedded?.budgetList || [];
        }
      })
    ).subscribe({
      next: async (budgets) => {
        this.budgets = budgets;
        await this.calculateAllProgress();
      },
      error: (error) => console.error('Error loading budgets:', error),
      complete: () => console.log('Budget loading complete')
    });
  }

  getProgress(budget: Budget): number {
    if (budget.id) {
      return this.progressData[budget.id] || 0;
    }

    return 0;
  }

  saveBudget(): void {
    this.budgetService.createOrUpdateBudget(this.newBudget).subscribe(() => {
      this.loadBudgets();
      this.newBudget = {
        category: undefined,
        amount: 0,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      };
    });
  }

  async calculateAllProgress(): Promise<void> {
    for (const budget of this.budgets) {
      const progress = await this.transactionFilterService.calculateProgress(budget);
      if (budget.id) {
        this.progressData[budget.id] = progress;
      }
    }
  }
}
