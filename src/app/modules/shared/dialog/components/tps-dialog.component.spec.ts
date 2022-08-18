import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpsDialogComponent } from './tps-dialog.component';

describe('TpsDialogComponent', () => {
  let component: TpsDialogComponent;
  let fixture: ComponentFixture<TpsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
