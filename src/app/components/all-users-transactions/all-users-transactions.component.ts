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
  displayedColumns: string[] = ['username', 'description', 'amount', 'date', 'type', 'category'];

  constructor(
    private transactionService: TransactionService,
    private transactionFilter: TransactionFilterService
  ) {}

  ngOnInit(): void {
    this.loadAllTransactions();
  }

  loadAllTransactions(): void {
    this.transactionService.getAllTransactions().subscribe((transactions: Transaction[]) => {
      this.transactions = transactions;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredTransactions = this.transactionFilter.applyFilters(this.transactions, this.filterType, this.filterCategory);
  }
}
