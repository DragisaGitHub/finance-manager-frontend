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
  };

  categories: Category[] = [];
  newCategoryName: string = '';
  showCategoryInput: boolean = false;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((response: any) => {
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
    this.transactionService
      .createTransaction(this.newTransaction)
      .subscribe(() => {
        this.transactionAdded.emit();
      });
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
}
