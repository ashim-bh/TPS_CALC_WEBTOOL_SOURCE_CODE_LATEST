import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ex5LoadFilesComponent } from './ex5-load-files.component';

describe('Ex5LoadFilesComponent', () => {
  let component: Ex5LoadFilesComponent;
  let fixture: ComponentFixture<Ex5LoadFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ex5LoadFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ex5LoadFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
