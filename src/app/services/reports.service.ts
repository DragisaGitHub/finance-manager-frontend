import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MonthlyReport } from '../models/monthly-report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiUrl = '/api/reports';

  constructor(private http: HttpClient) {}

  getMonthlyReport(year: number, month: number): Observable<MonthlyReport> {
    return this.http.get<MonthlyReport>(`${this.apiUrl}/monthly?year=${year}&month=${month}`);
  }
}
