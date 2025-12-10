// src/app/components/footer/footer.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FooterComponent } from './footer.component';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have currentYear set to current year', () => {
    const expectedYear = new Date().getFullYear();
    expect(component.currentYear).toBe(expectedYear);
  });

  it('should display the current year in footer', () => {
    const footerBottom = fixture.debugElement.query(By.css('.footer-bottom'));
    expect(footerBottom.nativeElement.textContent).toContain(component.currentYear.toString());
  });

  it('should display brand name', () => {
    const brandLogo = fixture.debugElement.query(By.css('.brand-logo h3'));
    expect(brandLogo.nativeElement.textContent).toContain('EK Ølbar');
  });

  it('should have four navigation links', () => {
    const links = fixture.debugElement.queryAll(By.css('.footer-links a'));
    expect(links.length).toBe(4);
  });

  it('should have correct link texts', () => {
    const links = fixture.debugElement.queryAll(By.css('.footer-links a'));
    const linkTexts = links.map(link => link.nativeElement.textContent.trim());
    
    expect(linkTexts).toContain('Hjem');
    expect(linkTexts).toContain('Ølkort');
    expect(linkTexts).toContain('Events');
    expect(linkTexts).toContain('Kontakt');
  });

  it('should display contact information', () => {
    const socialSection = fixture.debugElement.query(By.css('.footer-social'));
    const content = socialSection.nativeElement.textContent;
    
    expect(content).toContain('Instagram');
    expect(content).toContain('Facebook');
    expect(content).toContain('+45 33 12 34 56');
  });
});