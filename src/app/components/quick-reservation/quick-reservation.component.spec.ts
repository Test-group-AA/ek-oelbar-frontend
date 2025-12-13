import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuickReservationComponent } from './quick-reservation.component';

describe('QuickReservationComponent', () => {
  let component: QuickReservationComponent;
  let fixture: ComponentFixture<QuickReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickReservationComponent, HttpClientTestingModule]
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