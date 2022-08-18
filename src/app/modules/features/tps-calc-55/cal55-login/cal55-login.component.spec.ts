import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cal55LoginComponent } from './cal55-login.component';

describe('Cal55LoginComponent', () => {
  let component: Cal55LoginComponent;
  let fixture: ComponentFixture<Cal55LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Cal55LoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Cal55LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
