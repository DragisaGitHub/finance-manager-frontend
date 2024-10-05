import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DatePipe, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Role } from '../../models/role.model';
import { MatTab, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { TransactionComponent } from '../transaction/transaction.component';
import { AllUsersTransactionsComponent } from '../all-users-transactions/all-users-transactions.component';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    DatePipe,
    MatTabGroup,
    MatTab,
    TransactionComponent,
    AllUsersTransactionsComponent,
    NgIf,
    AddTransactionComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const currentUser = this.userService.getCurrentUserProfile();
    console.log('currentUser', currentUser);
    this.isAdmin = currentUser.roles.map(role => role.toUpperCase()).includes(Role.ADMIN);

    console.log('isAdmin', this.isAdmin);
  }
}
