import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs'; // Import MatTabGroup
import { UserService } from '../../services/user.service';
import { Role } from '../../models/role.model';
import { TransactionComponent } from '../transaction/transaction.component';
import { AllUsersTransactionsComponent } from '../all-users-transactions/all-users-transactions.component';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { NgIf } from '@angular/common';
import { Transaction } from '../../models/transaction.model';
import { SavingsGoalComponent } from '../savings-goal/savings-goal.component';
import { NotificationComponent } from '../notification/notification.component';
import { MonthlyReportComponent } from '../reports/monthly-report/monthly-report.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [
    MatTabGroup,
    TransactionComponent,
    AllUsersTransactionsComponent,
    AddTransactionComponent,
    MatTab,
    NgIf,
    SavingsGoalComponent,
    NotificationComponent,
    MonthlyReportComponent,
  ],
})
export class AdminDashboardComponent implements OnInit {
  isAdmin: boolean = false;

  @ViewChild('tabGroup', { static: true }) tabGroup!: MatTabGroup;
  @ViewChild(TransactionComponent) transactionComponent!: TransactionComponent;
  @ViewChild(AllUsersTransactionsComponent)
  allUsersTransactionsComponent!: AllUsersTransactionsComponent;
  @ViewChild(AddTransactionComponent)
  addTransactionComponent!: AddTransactionComponent;
  @ViewChild(SavingsGoalComponent) savingsGoalComponent!: SavingsGoalComponent;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isAdmin = this.userService.isAdmin();
  }

  navigateToMyTransactions(): void {
    this.tabGroup.selectedIndex = 0;
  }

  onTabChange(event: any): void {
    if (event.index === 0) {
      this.transactionComponent.loadTransactions();
    } else if (event.index === 1 && this.isAdmin) {
      this.allUsersTransactionsComponent.loadAllTransactions();
    }
  }

  onEditTransaction(transaction: Transaction): void {
    this.tabGroup.selectedIndex = 2;
    setTimeout(() => {
      this.addTransactionComponent.populateForm(transaction);
    }, 0);
  }

  refreshSavingsGoals(): void {
    this.savingsGoalComponent.loadGoals();
  }
}
