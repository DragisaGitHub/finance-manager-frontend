import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from '../../services/user.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Transaction, TransactionsService } from '../../api';
import { TransactionFilterService } from '../../services/transaction-filter.service';

@Component({
  selector: 'app-transaction',
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
    MatIcon,
    MatIconButton,
    MatMenu,
    MatButton,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  @Output() editTransactionEvent = new EventEmitter<Transaction>();

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  filterType: string = 'all';
  filterCategory: string = 'all';
  displayedColumns: string[] = [
    'description',
    'amount',
    'date',
    'type',
    'category',
    'actions',
  ];

  constructor(
    private transactionService: TransactionsService,
    private userService: UserService,
    private transactionFilter: TransactionFilterService,
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService
      .getTransactionsForCurrentUser()
      .subscribe({
        next: async (response: any) => {
          if (response instanceof Blob) {
            const text = await response.text();
            const jsonResponse = JSON.parse(text);
            this.transactions = jsonResponse || [];
          } else {
            this.transactions = response._embedded?.transactionList || [];
          }
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error loading transactions:', error);
        },
      });
  }

  applyFilters() {
    this.filteredTransactions = this.transactionFilter.applyFilters(
      this.transactions,
      this.filterType,
      this.filterCategory,
    );
  }

  editTransaction(transaction: Transaction): void {
    this.editTransactionEvent.emit(transaction);
  }

  deleteTransaction(transaction: Transaction): void {
    if (transaction.id !== undefined && confirm(`Are you sure you want to delete the transaction: "${transaction.description}"?`)) {
      this.transactionService
        .deleteTransaction(transaction.id)
        .subscribe(() => {
          this.loadTransactions();
        });
    } else {
      console.error("Transaction ID is undefined. Cannot delete transaction.");
    }
  }
}
