import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Calc55CompressorComponent } from './calc55-compressor.component';

describe('Calc55CompressorComponent', () => {
  let component: Calc55CompressorComponent;
  let fixture: ComponentFixture<Calc55CompressorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Calc55CompressorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Calc55CompressorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
