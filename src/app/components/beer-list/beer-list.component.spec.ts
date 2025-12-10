import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BeerListComponent } from './beer-list.component';
import { BeerService } from '../../services/beer.service';
import { Beer, BeerType } from '../../models/beer.model';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('BeerListComponent', () => {
  let component: BeerListComponent;
  let fixture: ComponentFixture<BeerListComponent>;
  let beerService: jasmine.SpyObj<BeerService>;

  const mockTapBeers: Beer[] = [
    { id: 1, name: 'Carlsberg', price: 45, description: 'Dansk pilsner', type: BeerType.TAP, available: true },
    { id: 2, name: 'Tuborg', price: 45, description: 'Frisk lager', type: BeerType.TAP, available: true }
  ];

  const mockBottledBeers: Beer[] = [
    { id: 3, name: 'Corona', price: 50, description: 'Mexicansk lager', type: BeerType.BOTTLED, available: true },
    { id: 4, name: 'Guinness', price: 55, description: 'Irsk stout', type: BeerType.BOTTLED, available: true }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BeerService', ['getTapBeers', 'getBottledBeers']);

    await TestBed.configureTestingModule({
      imports: [BeerListComponent, HttpClientTestingModule],
      providers: [{ provide: BeerService, useValue: spy }]
    }).compileComponents();

    beerService = TestBed.inject(BeerService) as jasmine.SpyObj<BeerService>;
  });

  describe('successful loading', () => {
    beforeEach(() => {
      beerService.getTapBeers.and.returnValue(of(mockTapBeers));
      beerService.getBottledBeers.and.returnValue(of(mockBottledBeers));
      fixture = TestBed.createComponent(BeerListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load tap beers on init', () => {
      expect(component.tapBeers.length).toBe(2);
      expect(component.tapBeers[0].name).toBe('Carlsberg');
    });

    it('should load bottled beers on init', () => {
      expect(component.bottledBeers.length).toBe(2);
      expect(component.bottledBeers[0].name).toBe('Corona');
    });

    it('should set isLoading to false after loading', () => {
      expect(component.isLoading).toBeFalse();
    });

    it('should render beer cards for tap beers', () => {
      const tapSection = fixture.debugElement.queryAll(By.css('.beer-section'))[0];
      const beerCards = tapSection.queryAll(By.css('.beer-card'));
      expect(beerCards.length).toBe(2);
    });

    it('should render beer cards for bottled beers', () => {
      const bottledSection = fixture.debugElement.queryAll(By.css('.beer-section'))[1];
      const beerCards = bottledSection.queryAll(By.css('.beer-card'));
      expect(beerCards.length).toBe(2);
    });

    it('should display beer name and price', () => {
      const firstCard = fixture.debugElement.query(By.css('.beer-card'));
      const name = firstCard.query(By.css('h3')).nativeElement.textContent;
      const price = firstCard.query(By.css('.price')).nativeElement.textContent;
      
      expect(name).toContain('Carlsberg');
      expect(price).toContain('45 kr');
    });

    it('should display happy hour section', () => {
      const happyHour = fixture.debugElement.query(By.css('.happy-hour'));
      expect(happyHour).toBeTruthy();
      expect(happyHour.nativeElement.textContent).toContain('Happy Hour');
    });
  });

  describe('loading state', () => {
    it('should show loading spinner initially', () => {
      beerService.getTapBeers.and.returnValue(of([]));
      beerService.getBottledBeers.and.returnValue(of([]));
      fixture = TestBed.createComponent(BeerListComponent);
      component = fixture.componentInstance;
      component.isLoading = true;
      fixture.detectChanges();

      const loading = fixture.debugElement.query(By.css('.loading'));
      expect(loading).toBeTruthy();
    });
  });

  describe('error handling', () => {
    it('should display error message on failure', fakeAsync(() => {
      beerService.getTapBeers.and.returnValue(throwError(() => new Error('Network error')));
      beerService.getBottledBeers.and.returnValue(of(mockBottledBeers));
      
      fixture = TestBed.createComponent(BeerListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(component.error).toBeTruthy();
    }));

    it('should call loadBeers when retry button is clicked', fakeAsync(() => {
      beerService.getTapBeers.and.returnValue(throwError(() => new Error('Error')));
      beerService.getBottledBeers.and.returnValue(of([]));
      
      fixture = TestBed.createComponent(BeerListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      beerService.getTapBeers.and.returnValue(of(mockTapBeers));
      spyOn(component, 'loadBeers').and.callThrough();
      
      const retryBtn = fixture.debugElement.query(By.css('.error button'));
      retryBtn.triggerEventHandler('click', null);
      
      expect(component.loadBeers).toHaveBeenCalled();
    }));
  });
});