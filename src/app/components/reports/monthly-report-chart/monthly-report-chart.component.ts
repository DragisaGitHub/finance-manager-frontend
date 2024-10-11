import { Component, OnInit, Input } from '@angular/core';
import { MonthlyReport } from '../../../models/monthly-report.model';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-monthly-report-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './monthly-report-chart.component.html',
  styleUrls: ['./monthly-report-chart.component.scss'],
})
export class MonthlyReportChartComponent implements OnInit {
  @Input() monthlyReport!: MonthlyReport;

  public barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };  // Provide an initial value

  ngOnInit(): void {
    if (this.monthlyReport) {
      this.loadChartData();
    }
  }

  loadChartData(): void {
    this.barChartData = {
      labels: ['Income', 'Expense'],
      datasets: [
        {
          label: 'Income vs Expense',
          data: [this.monthlyReport.totalIncome, this.monthlyReport.totalExpense],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        },
      ]
    };
  }
}
