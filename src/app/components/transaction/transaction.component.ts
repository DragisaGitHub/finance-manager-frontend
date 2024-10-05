import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from '../../services/user.service';
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
  ],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  filterType: string = 'all';
  filterCategory: string = 'all';
  displayedColumns: string[] = ['description', 'amount', 'date', 'type', 'category']; // Now this will be used

  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private transactionFilter: TransactionFilterService
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getTransactionsForCurrentUser().subscribe((transactions: Transaction[]) => {
      this.transactions = transactions;
      this.applyFilters(); // Now this method is properly called
    });
  }

  applyFilters() {
    // Apply the filtering logic using the TransactionFilterService
    this.filteredTransactions = this.transactionFilter.applyFilters(this.transactions, this.filterType, this.filterCategory);
  }
//this method has to be removed from here to the admin dashboard
  addTransaction(newTransaction: Transaction) {
    const currentUser = this.userService.getCurrentUserProfile();
    newTransaction.user = currentUser.username; // Assign the username as a string to the user property
    this.transactionService.createTransaction(newTransaction).subscribe(() => {
      this.loadTransactions();
    });
  }
}
