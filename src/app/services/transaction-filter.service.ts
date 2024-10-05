import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionFilterService {

  applyFilters(
    transactions: Transaction[],
    filterType: string,
    filterCategory: string
  ): Transaction[] {
    return transactions.filter(transaction => {
      const matchType = filterType === 'all' || transaction.type === filterType;
      const matchCategory =
        filterCategory === 'all' ||
        transaction.category?.name?.toLowerCase() === filterCategory.toLowerCase();
      return matchType && matchCategory;
    });
  }
}
