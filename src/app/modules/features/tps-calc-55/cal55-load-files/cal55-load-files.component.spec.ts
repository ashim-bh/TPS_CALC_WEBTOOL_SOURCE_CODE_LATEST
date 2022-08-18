import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cal55LoadFilesComponent } from './cal55-load-files.component';

describe('Cal55LoadFilesComponent', () => {
  let component: Cal55LoadFilesComponent;
  let fixture: ComponentFixture<Cal55LoadFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Cal55LoadFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Cal55LoadFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
