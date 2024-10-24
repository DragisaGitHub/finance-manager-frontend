import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { RecurringTransaction } from '../models/recurring-transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = '/api/transactions';

  constructor(private http: HttpClient) {}

  // Fetch transactions for the currently authenticated user (no username required)
  getTransactionsForCurrentUser(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/user`);
  }

  // Fetch all transactions (admin access only)
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/all`);
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}`, transaction);
  }

  editTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createRecurringTransaction(recurringTransaction: RecurringTransaction) {
    console.log('udje li kad ovde u recurring', recurringTransaction);
    return this.http.post<Transaction>(`${this.apiUrl}/recurring`, recurringTransaction);
  }
}
