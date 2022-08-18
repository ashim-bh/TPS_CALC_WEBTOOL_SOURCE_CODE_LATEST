import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ex5SearchComponent } from './ex5-search.component';

describe('Ex5SearchComponent', () => {
  let component: Ex5SearchComponent;
  let fixture: ComponentFixture<Ex5SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ex5SearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ex5SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
