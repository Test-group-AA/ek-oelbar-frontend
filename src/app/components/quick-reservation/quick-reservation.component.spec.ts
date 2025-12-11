import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickReservationComponent } from './quick-reservation.component';

describe('QuickReservationComponent', () => {
  let component: QuickReservationComponent;
  let fixture: ComponentFixture<QuickReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickReservationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuickReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
