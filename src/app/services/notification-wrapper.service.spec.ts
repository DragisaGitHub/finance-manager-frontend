import { TestBed } from '@angular/core/testing';

import { NotificationWrapperService } from './notification-wrapper.service';

describe('NotificationWrapperService', () => {
  let service: NotificationWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
