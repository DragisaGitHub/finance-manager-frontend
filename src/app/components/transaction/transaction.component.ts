import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from '../../services/user.service';
import { TransactionFilterService } from '../../services/transaction-filter.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

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
    private transactionService: TransactionService,
    private userService: UserService,
    private transactionFilter: TransactionFilterService,
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService
      .getTransactionsForCurrentUser()
      .subscribe((transactions: Transaction[]) => {
        this.transactions = transactions;
        this.applyFilters();
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
    if (
      confirm(
        `Are you sure you want to delete the transaction: "${transaction.description}"?`,
      )
    ) {
      this.transactionService
        .deleteTransaction(transaction.id)
        .subscribe(() => {
          this.loadTransactions();
          console.log('Transaction deleted:', transaction);
        });
    }
  }
}
