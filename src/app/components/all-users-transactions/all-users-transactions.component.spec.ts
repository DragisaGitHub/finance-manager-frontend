import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUsersTransactionsComponent } from './all-users-transactions.component';

describe('AllUsersTransactionsComponent', () => {
  let component: AllUsersTransactionsComponent;
  let fixture: ComponentFixture<AllUsersTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUsersTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllUsersTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
