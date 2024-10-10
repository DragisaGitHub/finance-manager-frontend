import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SavingsGoal } from '../models/savings-goal.model';

@Injectable({
  providedIn: 'root'
})
export class SavingsGoalService {
  private apiUrl = '/api/savings-goals';

  constructor(private http: HttpClient) {}

  // Create or update a savings goal
  createOrUpdateGoal(goal: SavingsGoal): Observable<SavingsGoal> {
    return this.http.post<SavingsGoal>(this.apiUrl, goal);
  }

  // Get all savings goals for the current user
  getUserSavingsGoals(): Observable<SavingsGoal[]> {
    return this.http.get<SavingsGoal[]>(this.apiUrl);
  }

  // Delete a savings goal by ID
  deleteGoal(goalId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${goalId}`);
  }

  addToGoal(goalId: number, amount: number): Observable<SavingsGoal> {
    return this.http.put<SavingsGoal>(`${this.apiUrl}/${goalId}/add`, null, {
      params: { amount: amount.toString() }
    });
  }
}
