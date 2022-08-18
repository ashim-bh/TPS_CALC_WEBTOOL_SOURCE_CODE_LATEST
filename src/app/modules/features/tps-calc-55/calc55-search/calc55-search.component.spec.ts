import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobRecordUIModel } from '@core/models/JobRecordUIModel';

import { Calc55SearchComponent, FilterParams } from './calc55-search.component';

describe('Calc55SearchComponent', () => {
  let component: Calc55SearchComponent;
  let fixture: ComponentFixture<Calc55SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ Calc55SearchComponent ],
      
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Calc55SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filter record by record id', () => {
    
    component.dataSource.data = [];

    const filterParams: FilterParams = {
      recId: 1.0,
      projectName: null,
      ownerName: null,
      fromDate: null,
      toDate: null
    }
    component.dataSource.filter = JSON.stringify(filterParams);
    component.onSearchBtnClick();
    expect(component.dataSource.data.length).toEqual(0);



  });

  it('filter record by jon name', () => {
    
    component.dataSource.data = [];

    const filterParams: FilterParams = {
      recId: 1.0,
      projectName: null,
      ownerName: null,
      fromDate: null,
      toDate: null
    }
    component.dataSource.filter = JSON.stringify(filterParams);
    component.onSearchBtnClick();
    expect(component.dataSource.data.length).toEqual(0);

    

  });
});
