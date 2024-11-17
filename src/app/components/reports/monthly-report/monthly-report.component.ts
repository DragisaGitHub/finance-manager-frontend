import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MonthlyReport, MonthlyReportsService } from '../../../api';

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

  constructor(private reportsService: MonthlyReportsService) {}

  ngOnInit(): void {
    this.loadMonthlyReport();
  }

  loadMonthlyReport(): void {
    const year = 2024;
    const month = 10;

    this.reportsService.getMonthlyReport(year, month).subscribe({
      next: async (response: any) => {
        let report: MonthlyReport;

        if (response instanceof Blob) {
          const text = await response.text(); // Convert Blob to text
          report = JSON.parse(text); // Parse text to JSON
        } else {
          report = response; // Assume it's already a JSON object
        }

        this.monthlyReport = report;

        // Use default values if totalIncome or totalExpense are undefined
        const totalIncome = report.totalIncome ?? 0;
        const totalExpense = report.totalExpense ?? 0;

        this.barChartData = {
          labels: ['Income', 'Expense'],
          datasets: [
            {
              data: [totalIncome, totalExpense],
              label: 'Total Income vs Expense',
              backgroundColor: ['#42A5F5', '#FF6384'],
            },
          ],
        };
      },
      error: (error) => console.error('Error loading monthly report:', error),
    });
  }
}
