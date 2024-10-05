import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

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
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
