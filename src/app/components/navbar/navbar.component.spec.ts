// src/app/components/navbar/navbar.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have mobileMenuOpen set to false initially', () => {
    expect(component.mobileMenuOpen).toBeFalse();
  });

  it('should toggle mobile menu when toggleMobileMenu is called', () => {
    expect(component.mobileMenuOpen).toBeFalse();
    
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen).toBeTrue();
    
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen).toBeFalse();
  });

  it('should close mobile menu when closeMobileMenu is called', () => {
    component.mobileMenuOpen = true;
    
    component.closeMobileMenu();
    
    expect(component.mobileMenuOpen).toBeFalse();
  });

  it('should display logo with correct text', () => {
    const logoTitle = fixture.debugElement.query(By.css('.logo-title'));
    expect(logoTitle.nativeElement.textContent).toContain('EK Ølbar');
  });

  it('should have four navigation links in desktop nav', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('.nav-desktop .nav-link'));
    expect(navLinks.length).toBe(4);
  });

  it('should show mobile nav when mobileMenuOpen is true', () => {
    component.mobileMenuOpen = true;
    fixture.detectChanges();
    
    const mobileNav = fixture.debugElement.query(By.css('.nav-mobile'));
    expect(mobileNav).toBeTruthy();
  });

  it('should hide mobile nav when mobileMenuOpen is false', () => {
    component.mobileMenuOpen = false;
    fixture.detectChanges();
    
    const mobileNav = fixture.debugElement.query(By.css('.nav-mobile'));
    expect(mobileNav).toBeFalsy();
  });
});