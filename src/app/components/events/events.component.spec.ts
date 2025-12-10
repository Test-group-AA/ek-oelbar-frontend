// src/app/components/events/events.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventsComponent } from './events.component';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let eventService: jasmine.SpyObj<EventService>;

  const mockEvents: Event[] = [
    {
      id: 1,
      title: 'Live Jazz Aften',
      date: '2025-11-08',
      startTime: '20:00:00',
      endTime: '23:00:00',
      artist: 'The Copenhagen Jazz Trio',
      description: 'Klassisk jazz i hyggelige omgivelser',
      emoji: '🎷',
      freeEntry: true,
      reservationRequired: false
    },
    {
      id: 2,
      title: 'Trylleshow',
      date: '2025-11-15',
      startTime: '19:30:00',
      endTime: '21:30:00',
      artist: 'Den Mystiske Magnus',
      description: 'Fantastisk close-up magi ved bordene',
      emoji: '🎩',
      freeEntry: true,
      reservationRequired: false
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('EventService', ['getUpcomingEvents']);

    await TestBed.configureTestingModule({
      imports: [EventsComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: EventService, useValue: spy }]
    }).compileComponents();

    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
  });

  describe('successful loading', () => {
    beforeEach(() => {
      eventService.getUpcomingEvents.and.returnValue(of(mockEvents));
      fixture = TestBed.createComponent(EventsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load events on init', () => {
      expect(component.events.length).toBe(2);
    });

    it('should set isLoading to false after loading', () => {
      expect(component.isLoading).toBeFalse();
    });

    it('should render event cards', () => {
      const eventCards = fixture.debugElement.queryAll(By.css('.event-card'));
      expect(eventCards.length).toBe(2);
    });

    it('should display event title', () => {
      const title = fixture.debugElement.query(By.css('.event-info h3'));
      expect(title.nativeElement.textContent).toContain('Live Jazz Aften');
    });

    it('should display artist name', () => {
      const artist = fixture.debugElement.query(By.css('.artist'));
      expect(artist.nativeElement.textContent).toContain('The Copenhagen Jazz Trio');
    });

    it('should display free entry badge when event is free', () => {
      const freeBadge = fixture.debugElement.query(By.css('.badge.free'));
      expect(freeBadge).toBeTruthy();
      expect(freeBadge.nativeElement.textContent).toContain('Gratis');
    });

    it('should display CTA section', () => {
      const cta = fixture.debugElement.query(By.css('.cta-section'));
      expect(cta).toBeTruthy();
    });
  });

  describe('formatDate method', () => {
    beforeEach(() => {
      eventService.getUpcomingEvents.and.returnValue(of([]));
      fixture = TestBed.createComponent(EventsComponent);
      component = fixture.componentInstance;
    });

    it('should format date correctly', () => {
      const formatted = component.formatDate('2025-11-08');
      expect(formatted).toContain('november');
      expect(formatted).toContain('2025');
    });
  });

  describe('formatTime method', () => {
    beforeEach(() => {
      eventService.getUpcomingEvents.and.returnValue(of([]));
      fixture = TestBed.createComponent(EventsComponent);
      component = fixture.componentInstance;
    });

    it('should format time correctly', () => {
      const formatted = component.formatTime('20:00:00');
      expect(formatted).toBe('20:00');
    });

    it('should handle different time formats', () => {
      expect(component.formatTime('19:30:00')).toBe('19:30');
      expect(component.formatTime('09:00:00')).toBe('09:00');
    });
  });

  describe('error handling', () => {
    it('should display error message on failure', fakeAsync(() => {
      eventService.getUpcomingEvents.and.returnValue(throwError(() => new Error('Network error')));
      fixture = TestBed.createComponent(EventsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(component.error).toBeTruthy();
      const errorEl = fixture.debugElement.query(By.css('.error'));
      expect(errorEl).toBeTruthy();
    }));

    it('should call loadEvents when retry button is clicked', fakeAsync(() => {
      eventService.getUpcomingEvents.and.returnValue(throwError(() => new Error('Error')));
      fixture = TestBed.createComponent(EventsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      eventService.getUpcomingEvents.and.returnValue(of(mockEvents));
      spyOn(component, 'loadEvents').and.callThrough();

      const retryBtn = fixture.debugElement.query(By.css('.error button'));
      retryBtn.triggerEventHandler('click', null);

      expect(component.loadEvents).toHaveBeenCalled();
    }));
  });

  describe('empty state', () => {
    it('should display no events message when list is empty', () => {
      eventService.getUpcomingEvents.and.returnValue(of([]));
      fixture = TestBed.createComponent(EventsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const noEvents = fixture.debugElement.query(By.css('.no-events'));
      expect(noEvents).toBeTruthy();
    });
  });
});