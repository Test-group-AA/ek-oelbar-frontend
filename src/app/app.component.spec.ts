// src/app/app.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        NavbarComponent,
        FooterComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "EK Ølbar"', () => {
    expect(component.title).toBe('EK Ølbar');
  });

  it('should render navbar component', () => {
    const navbar = fixture.debugElement.query(By.css('app-navbar'));
    expect(navbar).toBeTruthy();
  });

  it('should render footer component', () => {
    const footer = fixture.debugElement.query(By.css('app-footer'));
    expect(footer).toBeTruthy();
  });

  it('should have router outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });

  it('should have main content container', () => {
    const mainContent = fixture.debugElement.query(By.css('.main-content'));
    expect(mainContent).toBeTruthy();
  });

  it('should have app container with flex layout', () => {
    const appContainer = fixture.debugElement.query(By.css('.app-container'));
    expect(appContainer).toBeTruthy();
  });
});