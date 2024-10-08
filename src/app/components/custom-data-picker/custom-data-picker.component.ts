import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { startWith, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-custom-data-picker',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-data-picker.component.html',
  styleUrl: './custom-data-picker.component.scss',
})
export class CustomDataPickerComponent<D> implements OnDestroy {
  private _calendar = inject<MatCalendar<D>>(MatCalendar);
  private _dateAdapter = inject<DateAdapter<D>>(DateAdapter);
  private _dateFormats = inject(MAT_DATE_FORMATS);

  private _destroyed = new Subject<void>();

  readonly periodLabel = signal('');

  constructor() {
    this._calendar.stateChanges
      .pipe(startWith(null), takeUntil(this._destroyed))
      .subscribe(() => {
        this.periodLabel.set(
          this._dateAdapter
            .format(
              this._calendar.activeDate,
              this._dateFormats.display.monthYearLabel,
            )
            .toLocaleUpperCase(),
        );
      });
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  previousClicked(mode: 'month' | 'year') {
    this._calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  }

  nextClicked(mode: 'month' | 'year') {
    this._calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  }
}
