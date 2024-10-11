import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MonthlyReport } from '../../../models/monthly-report.model';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-monthly-report',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.scss'],
})
export class MonthlyReportComponent implements OnInit {
  public monthlyReport: MonthlyReport | null = null; // Initialize variable
  public barChartData: ChartData<'bar'> | undefined;
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.loadMonthlyReport();
  }

  loadMonthlyReport(): void {
    const year = 2024;
    const month = 10;
    this.reportsService
      .getMonthlyReport(year, month)
      .subscribe((report: MonthlyReport) => {
        this.monthlyReport = report; // Set the data to monthlyReport
        this.barChartData = {
          labels: ['Income', 'Expense'],
          datasets: [
            {
              data: [report.totalIncome, report.totalExpense],
              label: 'Total Income vs Expense',
              backgroundColor: ['#42A5F5', '#FF6384'],
            },
          ],
        };
      });
  }
}
