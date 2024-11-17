import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TransactionFilterService } from '../../services/transaction-filter.service';
import { Transaction, TransactionsService } from '../../api';

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
    private transactionService: TransactionsService,
    private transactionFilter: TransactionFilterService
  ) {}

  ngOnInit(): void {
    this.loadAllTransactions();
  }

  loadAllTransactions(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: async (response: any) => {
        this.transactions = await this.parseTransactionsResponse(response);
        this.categories = this.getUniqueCategories();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
      }
    });
  }

  private async parseTransactionsResponse(response: any): Promise<Transaction[]> {
    if (response instanceof Blob) {
      const text = await response.text();
      const jsonResponse = JSON.parse(text);
      return jsonResponse || [];
    }
    return response._embedded?.transactionList || [];
  }

  getUniqueCategories(): string[] {
    const categoriesSet = new Set<string>();
    this.transactions.forEach(transaction => {
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
