// src/app/components/home/home.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Features', () => {
    it('should have 3 features', () => {
      expect(component.features.length).toBe(3);
    });

    it('should render all feature cards', () => {
      const featureCards = fixture.debugElement.queryAll(By.css('.feature-card'));
      expect(featureCards.length).toBe(3);
    });

    it('should display correct feature titles', () => {
      const featureCards = fixture.debugElement.queryAll(By.css('.feature-card h3'));
      const titles = featureCards.map(card => card.nativeElement.textContent.trim());
      
      expect(titles).toContain('Vores fadøl');
      expect(titles).toContain('Live musik');
      expect(titles).toContain('Hyggelige lokaler');
    });

    it('each feature should have emoji, title and description', () => {
      component.features.forEach(feature => {
        expect(feature.emoji).toBeTruthy();
        expect(feature.title).toBeTruthy();
        expect(feature.description).toBeTruthy();
      });
    });
  });

  describe('History', () => {
    it('should have 3 history items', () => {
      expect(component.history.length).toBe(3);
    });

    it('should render all timeline items', () => {
      const timelineItems = fixture.debugElement.queryAll(By.css('.timeline-item'));
      expect(timelineItems.length).toBe(3);
    });

    it('should display correct years', () => {
      const years = fixture.debugElement.queryAll(By.css('.timeline-year'));
      const yearTexts = years.map(y => y.nativeElement.textContent.trim());
      
      expect(yearTexts).toContain('2020');
      expect(yearTexts).toContain('2022');
      expect(yearTexts).toContain('2025');
    });

    it('each history item should have year, title and description', () => {
      component.history.forEach(item => {
        expect(item.year).toBeTruthy();
        expect(item.title).toBeTruthy();
        expect(item.description).toBeTruthy();
      });
    });
  });

  describe('Hero Section', () => {
    it('should display hero title', () => {
      const heroTitle = fixture.debugElement.query(By.css('.hero-content h1'));
      expect(heroTitle.nativeElement.textContent).toContain('EK Ølbar');
    });

    it('should display hero subtitle', () => {
      const subtitle = fixture.debugElement.query(By.css('.subtitle'));
      expect(subtitle.nativeElement.textContent).toContain('Din nye yndlings ølbar');
    });

    it('should have two hero buttons', () => {
      const buttons = fixture.debugElement.queryAll(By.css('.hero-buttons .btn'));
      expect(buttons.length).toBe(2);
    });

    it('should have correct router links on buttons', () => {
      const primaryBtn = fixture.debugElement.query(By.css('.btn-primary'));
      const outlineBtn = fixture.debugElement.query(By.css('.btn-outline'));
      
      expect(primaryBtn.attributes['routerLink']).toBe('/beer');
      expect(outlineBtn.attributes['routerLink']).toBe('/events');
    });
  });

  describe('Welcome Section', () => {
    it('should display welcome heading', () => {
      const heading = fixture.debugElement.query(By.css('.welcome-section h2'));
      expect(heading.nativeElement.textContent).toContain('Velkommen til EK Ølbar');
    });

    it('should have highlighted text about friday events', () => {
      const highlight = fixture.debugElement.query(By.css('.highlight'));
      expect(highlight.nativeElement.textContent).toContain('fredag');
    });
  });
});