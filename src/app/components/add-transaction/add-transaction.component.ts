import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  TransactionsService,
  Transaction,
  Category,
  RecurringTransaction,
  CategoriesService,
} from '../../api';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgIf,
    NgForOf,
    MatCheckbox,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
  ],
})
export class AddTransactionComponent implements OnInit {
  @Output() transactionAdded = new EventEmitter<void>();

  newTransaction: Transaction = {
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: Transaction.TypeEnum.Expense,
    category: undefined,
    recurringTransactions: [],
  };

  // Component-specific properties
  isRecurring: boolean = false;
  frequency: string = '';
  nextOccurrence: string = '';

  categories: Category[] = [];
  newCategoryName: string = '';
  showCategoryInput: boolean = false;

  constructor(
    private transactionService: TransactionsService,
    private userService: UserService,
    private categoryService: CategoriesService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: async (response: any) => {
        if (response instanceof Blob) {
          const text = await response.text();
          const jsonResponse = JSON.parse(text);
          this.categories = jsonResponse._embedded?.categoryList || [];
        } else {
          this.categories = response._embedded?.categoryList || [];
        }
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
      },
      complete: () => {
        console.log('Categories loaded successfully');
      },
    });
  }

  populateForm(transaction: Transaction): void {
    this.newTransaction = { ...transaction };
  }

  clearAmountIfZero(): void {
    if (this.newTransaction.amount === 0) {
      this.newTransaction.amount = 0;
    }
  }

  createCategory(): void {
    const newCategory: Category = { name: this.newCategoryName };
    this.categoryService.createCategory(newCategory).subscribe({
      next: (createdCategory: Category) => {
        this.categories.push(createdCategory);
        this.newTransaction.category = createdCategory;
        this.showCategoryInput = false;
        this.newCategoryName = '';
      },
      error: (error) => console.error('Error creating category', error),
    });
  }

  onCategoryChange(event: any): void {
    if (event.value) {
      this.showCategoryInput = false;
      this.newCategoryName = '';
    } else {
      this.newTransaction.category = { id: 0, name: '' };
    }
  }

  addTransaction(): void {
    this.newTransaction.username = this.userService.getUsername();
    if (this.newTransaction.id) {
      this.updateTransaction(this.newTransaction);
    } else {
      this.createTransaction(this.newTransaction);
    }
  }

  createTransaction(transaction: Transaction): void {
    if (this.isRecurring) {
      this.transactionService.createTransaction(transaction).subscribe({
        next: async (response) => {
          let savedTransaction = response;

          if (response instanceof Blob) {
            const text = await response.text();
            savedTransaction = JSON.parse(text);
          }
          const recurringTransaction: RecurringTransaction = {
            transaction: savedTransaction,
            frequency: this.frequency,
            nextOccurrence: this.nextOccurrence,
          };

          this.transactionService
            .createRecurringTransaction(recurringTransaction)
            .subscribe({
              next: () => {
                this.transactionAdded.emit();
                this.resetForm();
              },
              error: (error: HttpErrorResponse) => {
                console.error(
                  'Error creating recurring transaction:',
                  error.message,
                  error,
                );
              },
            });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error creating transaction:', error.message, error);
        },
      });
    } else {
      this.transactionService.createTransaction(transaction).subscribe({
        next: () => {
          this.transactionAdded.emit();
          this.resetForm();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error creating transaction:', error.message, error);
        },
      });
    }
  }

  updateTransaction(transaction: Transaction): void {
    if (transaction.id)
      this.transactionService
        .replaceTransaction(transaction.id, transaction)
        .subscribe({
          next: (updatedTransaction) => {
            this.transactionAdded.emit();
            this.resetForm();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error updating transaction:', error.message, error);
          },
        });
  }

  compareCategories(c1: Category, c2: Category): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  resetForm(): void {
    this.newTransaction = {
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: Transaction.TypeEnum.Expense,
      category: undefined,
      recurringTransactions: [],
    };
    this.isRecurring = false;
    this.frequency = '';
    this.nextOccurrence = '';
  }

  handleAddNewCategory(): void {
    this.showCategoryInput = true;
    this.newTransaction.category = { id: 0, name: '' };
  }
}
