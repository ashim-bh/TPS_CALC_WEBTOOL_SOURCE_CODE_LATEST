import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ex5HomeComponent } from './ex5-home.component';

describe('Ex5HomeComponent', () => {
  let component: Ex5HomeComponent;
  let fixture: ComponentFixture<Ex5HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ex5HomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ex5HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
