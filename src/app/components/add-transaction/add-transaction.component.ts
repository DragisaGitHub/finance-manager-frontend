import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  templateUrl: './add-transaction.component.html',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    MatLabel
  ],
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent implements OnInit {
  newTransaction: Transaction = {
    id: 0,
    description: '',
    amount: 0,
    date: '',
    type: '',
    user: '',
    category: {
      id: 0, name: '',
      transactions: [],
    }
  };

  constructor(private transactionService: TransactionService, private userService: UserService) {}

  ngOnInit() {}

  addTransaction() {
    const currentUser = this.userService.getCurrentUserProfile();
    this.newTransaction.user = currentUser.username;
    this.transactionService.createTransaction(this.newTransaction).subscribe(() => {
      // Handle success (e.g., show a message or reset the form)
    });
  }
}

