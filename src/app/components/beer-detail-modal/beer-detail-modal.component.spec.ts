import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeerDetailModalComponent } from './beer-detail-modal.component';

describe('BeerDetailModalComponent', () => {
  let component: BeerDetailModalComponent;
  let fixture: ComponentFixture<BeerDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeerDetailModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BeerDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
