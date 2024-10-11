import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyReportChartComponent } from './monthly-report-chart.component';

describe('MonthlyReportChartComponent', () => {
  let component: MonthlyReportChartComponent;
  let fixture: ComponentFixture<MonthlyReportChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyReportChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyReportChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
