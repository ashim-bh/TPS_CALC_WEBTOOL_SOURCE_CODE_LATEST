import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Calc55HomeComponent } from './calc55-home.component';

describe('Calc55HomeComponent', () => {
  let component: Calc55HomeComponent;
  let fixture: ComponentFixture<Calc55HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Calc55HomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Calc55HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
