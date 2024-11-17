import { Injectable } from '@angular/core';
import { Budget, Transaction, TransactionsService } from '../api';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionFilterService extends TransactionsService {
  applyFilters(
    transactions: Transaction[],
    filterType: string,
    filterCategory: string,
  ): Transaction[] {
    return transactions.filter((transaction) => {
      const matchType = filterType === 'all' || transaction.type === filterType;
      const matchCategory =
        filterCategory === 'all' ||
        transaction.category?.name?.toLowerCase() ===
          filterCategory.toLowerCase();
      return matchType && matchCategory;
    });
  }

  async calculateSpentAmount(budget: Budget): Promise<number> {
    const categoryName = budget.category?.name?.toLowerCase();

    const response = await firstValueFrom(this.getAllTransactions());

    let transactions: any[];
    if (response instanceof Blob) {
      const text = await response.text();
      const jsonResponse = JSON.parse(text);
      transactions = jsonResponse._embedded?.transactionList || [];
    } else {
      transactions = response || [];
    }

    const filteredTransactions = transactions.filter(
      (transaction: Transaction) => {
        const isExpense = transaction.type === 'EXPENSE';
        const matchesCategory =
          transaction.category?.name?.toLowerCase() === categoryName;
        return isExpense && matchesCategory;
      },
    );

    return filteredTransactions.reduce(
      (total: number, transaction: Transaction) => {
        const amount = transaction.amount || 0;
        return total + amount;
      },
      0,
    );
  }

  async calculateProgress(budget: Budget): Promise<number> {
    const spent = await this.calculateSpentAmount(budget);
    return budget.amount ? (spent / budget.amount) * 100 : 0;
  }
}
