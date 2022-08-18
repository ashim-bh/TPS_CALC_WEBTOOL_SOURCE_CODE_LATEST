import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ex5CompressorComponent } from './ex5-compressor.component';

describe('Ex5CompressorComponent', () => {
  let component: Ex5CompressorComponent;
  let fixture: ComponentFixture<Ex5CompressorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ex5CompressorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ex5CompressorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
