import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { TransactionFilterService } from '../../services/transaction-filter.service';

@Component({
  selector: 'app-all-users-transactions',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    NgIf,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './all-users-transactions.component.html',
  styleUrls: ['./all-users-transactions.component.scss'],
})
export class AllUsersTransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  filterType: string = 'all';
  filterCategory: string = 'all';
  categories: string[] = [];

  constructor(
    private transactionService: TransactionService,
    private transactionFilter: TransactionFilterService
  ) {}

  ngOnInit(): void {
    this.loadAllTransactions();
  }

  loadAllTransactions(): void {
    this.transactionService.getAllTransactions().subscribe((response: any) => {
      this.transactions = response._embedded?.transactionList || [];
      this.categories = this.getUniqueCategories();
      this.applyFilters();
    });
  }

  getUniqueCategories(): string[] {
    const categoriesSet = new Set<string>();
    this.transactions.forEach(transaction => {
      console.log('transaction', transaction);
      console.log('transaction.category', transaction.category?.name);
      if (transaction.category?.name) {
        categoriesSet.add(transaction.category.name);
      }
    });
    return Array.from(categoriesSet);
  }

  applyFilters() {
    this.filteredTransactions = this.transactionFilter.applyFilters(this.transactions, this.filterType, this.filterCategory);
  }
}
