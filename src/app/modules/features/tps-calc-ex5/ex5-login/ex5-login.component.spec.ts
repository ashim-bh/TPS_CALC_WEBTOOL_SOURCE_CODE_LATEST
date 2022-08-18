import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ex5LoginComponent } from './ex5-login.component';

describe('Ex5LoginComponent', () => {
  let component: Ex5LoginComponent;
  let fixture: ComponentFixture<Ex5LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ex5LoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ex5LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
