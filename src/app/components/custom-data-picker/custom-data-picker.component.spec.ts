import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDataPickerComponent } from './custom-data-picker.component';

describe('CustomDataPickerComponent', () => {
  let component: CustomDataPickerComponent;
  let fixture: ComponentFixture<CustomDataPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDataPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDataPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
