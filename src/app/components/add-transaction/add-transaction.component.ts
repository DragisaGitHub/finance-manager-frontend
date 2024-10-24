import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';
import { Category } from '../../models/category.model';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { RecurringTransaction } from '../../models/recurring-transaction.model';

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
    id: 0,
    description: '',
    amount: null,
    date: '',
    type: '',
    user: '',
    category: {
      id: 0,
      name: '',
      transactions: [],
    },
    frequency: '',
    nextOccurrence: '',
  };

  categories: Category[] = [];
  newCategoryName: string = '';
  showCategoryInput: boolean = false;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((response: any) => {
      console.log('response', response);
      this.categories = response._embedded.categoryList;
    });
  }

  createCategory(): void {
    const newCategory: Category = {
      name: this.newCategoryName,
      id: 0,
      transactions: [],
    };
    this.categoryService
      .createCategory(newCategory)
      .subscribe((createdCategory: Category) => {
        this.categories.push(createdCategory);
        this.newTransaction.category = createdCategory;
        this.showCategoryInput = false;
        this.newCategoryName = '';
      });
  }

  addTransaction(): void {
    this.newTransaction.user = this.userService.getUsername();

    if (this.newTransaction.isRecurring) {
      console.log('this.newTransaction', this.newTransaction);
      this.transactionService.createTransaction(this.newTransaction).subscribe({
        next: (savedTransaction) => {
          console.log('Transaction successfully created', savedTransaction);

          const recurringTransaction: RecurringTransaction = {
            id: 0,
            transaction: savedTransaction,
            frequency: this.newTransaction.frequency,
            nextOccurrence: this.newTransaction.nextOccurrence,
          };

          this.transactionService.createRecurringTransaction(recurringTransaction).subscribe({
            next: () => {
              console.log('Recurring transaction successfully created');
              this.transactionAdded.emit();
              this.resetForm();
            },
            error: (err) => {
              console.error('Error creating recurring transaction', err);
            },
          });
        },
        error: (err) => {
          console.error('Error creating transaction', err);
        },
      });
    } else {
      this.transactionService.createTransaction(this.newTransaction).subscribe({
        next: () => {
          console.log('Regular transaction successfully created');
          this.transactionAdded.emit();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error creating regular transaction', err);
        },
      });
    }
  }

  compareCategories(c1: Category, c2: Category): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  populateForm(transaction: Transaction): void {
    this.newTransaction = { ...transaction };
  }

  onCategoryChange(event: any): void {
    if (event.value) {
      this.showCategoryInput = false;
      this.newCategoryName = '';
    } else {
      this.newTransaction.category = { id: 0, name: '', transactions: [] };
    }
  }

  clearAmountIfZero(): void {
    if (this.newTransaction.amount === 0) {
      this.newTransaction.amount = null;
    }
  }

  resetForm(): void {
    this.newTransaction = {
      id: 0,
      description: '',
      amount: null,
      date: '',
      type: '',
      user: '',
      category: {
        id: 0,
        name: '',
        transactions: [],
      },
      frequency: '',
      nextOccurrence: '',
    };
  }
}
