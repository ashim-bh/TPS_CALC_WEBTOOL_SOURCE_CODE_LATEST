import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { CompressorDetailUIModel, Portion } from '@core/models/CompressorDetailUIModel';
import { JobRecordUIModel } from '@core/models/JobRecordUIModel';
import { UtilityService } from '@core/services/utility.service';

@Component({
  selector: 'tps-calc55-compressor',
  templateUrl: './calc55-compressor.component.html',
  styleUrls: ['./calc55-compressor.component.scss']
})
export class Calc55CompressorComponent implements OnInit {

  @Input() data: CompressorDetailUIModel[];
  @Input() editMode: boolean;
  @Output() onCompDataChange: EventEmitter<CompressorData> = new EventEmitter<CompressorData>();

  selPosition = null;
  selOutlet = null;
  selStartAngle = null;
  selCollector = false
  displayedColumns = ['id', 'compType', 'name','ps', 'position', 'outlet', 'collector', 'startAngle'];
  compressorList;
  dataSource: MatTableDataSource<CompressorDetailUIModel>;
  selection = new SelectionModel<CompressorDetailUIModel>(true, []);
  row: any;
  value: any;
  element: any;
  collectorName:any;
  
  loadFileVals1 = new Array<{compressor: any, portion: any}>();

  // loadFileVals = new Map<string, string>();
  portionVals = new Map<string,string>();
  loadFilesEnabled:boolean;
  portionEnabled:boolean;
  noCheck:number;
  dataUserStatus: boolean;
  currentJob: JobRecordUIModel;
  rowActiveCompressor1: boolean;
  rowActiveCompressor2: boolean;
  rowActiveCompressor3: boolean;
  rowActiveCompressor: boolean;
  st: number=0;

  constructor(private utilityService: UtilityService) { }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  
  updateDataList(value: boolean,name: string,id:any){
    if(name=="collector")
    {
       this.dataSource.data.forEach(row => {
         if(row.compId==id)
         {
        
        row.collector = value;
         }
      });
    }
  }
  masterToggle() {

    
    if (this.displayedColumns.includes('value')) {
      this.displayedColumns = ['id', 'compType', 'name', 'portionsDetails','ps', 'position', 'outlet', 'collector', 'startAngle', 'value'];
    }
    else {
      this.displayedColumns = ['id', 'compType', 'name', 'portionsDetails','ps', 'position', 'outlet', 'collector', 'startAngle'];
    }

    if (this.isAllSelected()) {
      this.dataSource.data.forEach(record => {
        record.checkedStatus = false;
        record.portion.forEach(item => item.checked = false);
        if (this.displayedColumns.includes('value')) {
          this.displayedColumns = ['id', 'compType', 'name','ps', 'position', 'outlet', 'collector', 'startAngle', 'value'];
        }
        else {
          this.displayedColumns = ['id', 'compType', 'name','ps', 'position', 'outlet', 'collector', 'startAngle'];

        }
        this.loadFileVals1.pop();
      });
      this.loadFilesEnabled=false;
      this.utilityService.setLoadFilesButton(this.loadFilesEnabled);
      this.selection.clear()
    } 
    else {
      this.dataSource.data.forEach(row => {
        row.checkedStatus = true;
        row.portion.forEach(item => item.checked = true);
        this.selection.select(row);
        if (this.displayedColumns.includes('value')) {
          this.displayedColumns = ['id', 'compType', 'name', 'portionsDetails','ps', 'position', 'outlet', 'collector', 'startAngle', 'value'];
        }
        else {
          this.displayedColumns = ['id', 'compType', 'name', 'portionsDetails','ps', 'position', 'outlet', 'collector', 'startAngle'];

        }
        row.portion.forEach(element=>{
        this.loadFileVals1.push({compressor:row.compType,portion:element.name})
      })
      });
      this.loadFilesEnabled=true;
      this.utilityService.setLoadFilesButton(this.loadFilesEnabled);
    }
    this.utilityService.getLoadFilesData(this.loadFileVals1);
    this.validateCompDetails();

  }
  onValueChange(record: CompressorDetailUIModel) {
    
    let countval=0;

    if (record.startAngle === 'Manual') {
      record.thetaEnabled=true;
      record['isEnabled1']=true;
      if (this.displayedColumns.includes('portionsDetails')) {
        this.displayedColumns = ['id', 'compType', 'name', 'portionsDetails','ps', 'position', 'outlet', 'collector', 'startAngle', 'value'];
                
      }
      else {
        this.displayedColumns = ['id', 'compType', 'name','ps', 'position', 'outlet', 'collector', 'startAngle', 'value'];
      }
      
    }

    else {
      record['isEnabled1']=false;
      record.thetaEnabled=false;
      this.dataSource.data.forEach(item=>{
        if(item.startAngle!="Manual")
        {
          countval++;
        }
      })
      if(countval==this.dataSource.data.length)
      {
        if (this.displayedColumns.includes('portionsDetails')) {
          this.displayedColumns = ['id', 'compType', 'name', 'portionsDetails','ps', 'position', 'outlet', 'collector', 'startAngle'];
         }
         else {
           this.displayedColumns = ['id', 'compType', 'name','ps', 'position', 'outlet', 'collector', 'startAngle'];
         }
      }  
    }
        

    this.validateCompDetails();
  }

  onRowChecked(record: CompressorDetailUIModel, event: MatCheckboxChange) {
    record.checkedStatus = event.checked;
      record.portion.forEach(item => {
      item.checked = event.checked;
      
    });
    this.displayedColumns.forEach(element => {
      if (element == 'value')
        this.displayedColumns = ['id', 'compType', 'name', 'portionsDetails','ps', 'position', 'outlet', 'collector', 'startAngle', 'value'];

      else this.displayedColumns = ['id', 'compType', 'name', 'portionsDetails','ps', 'position', 'outlet', 'collector', 'startAngle'];

    });
    
  this.noCheck=0;

    this.selection.toggle(record);
    if(record.checkedStatus==true)
    {
      record.portion.forEach(element=>{
        if(element.checked){
        // this.loadFileVals.set(record.compType,element.name)
        this.loadFileVals1.push({compressor:record.compType,portion:element.name})
       
        }
      })
      
    }
    if(record.checkedStatus==false)
    {
      
      // this.loadFileVals.delete(record.compType)
      
      var numArr=new Array;
      this.loadFileVals1.forEach(element=>{
        if(element.compressor===record.compType)
        {
         numArr.push(this.loadFileVals1.indexOf(element))
          // this.loadFileVals1.splice(this.loadFileVals1.indexOf(element),1);      
        }
      });
      numArr=numArr.sort((a, b) => b-a)
      for(let i=0;i<numArr.length; i++)
      {
          this.loadFileVals1.splice(numArr[i],1);
      }
    }
    if(this.loadFileVals1.length==0)
    {
      this.loadFilesEnabled=false;
      this.utilityService.setLoadFilesButton(this.loadFilesEnabled);
    }
    else{
      this.loadFilesEnabled=true;
      this.utilityService.setLoadFilesButton(this.loadFilesEnabled);
    }
    this.utilityService.getLoadFilesData(this.loadFileVals1);
    this.utilityService.getLoadFilesPortionData(this.portionVals);
    this.validateCompDetails();
    // //console.log(this.loadFileVals)

  }

  onPortionChange(record: CompressorDetailUIModel, portion: Portion, event: MatCheckboxChange) {

    let count = 0;
    portion.checked = event.checked;
    record.portion.forEach(item => {
      item.checked = item.portionId === portion.portionId ? event.checked : item.checked;
      if (item.checked) count++;
    });
    record.checkedStatus = count > 0 ? true : false;
    if (record.checkedStatus) {
      this.selection.select(record);
    } else {
      this.selection.deselect(record);
            
    }

    if(event.checked)
    {
      this.loadFileVals1.push({compressor:record.compType,portion:portion.name})
    }
    else{
      //deletion for loadfiles
      var numArr=new Array;
      this.loadFileVals1.forEach(element=>{
        if(element.compressor===record.compType)
        {
          if(element.portion===portion.name)
          {
         numArr.push(this.loadFileVals1.indexOf(element))
        }
        // this.loadFileVals1.splice(this.loadFileVals1.indexOf(element),1);      
        }
      });
      numArr=numArr.sort((a, b) => b-a)
      for(let i=0;i<numArr.length; i++)
      {
          this.loadFileVals1.splice(numArr[i],1);
      }
    }
    this.utilityService.getLoadFilesData(this.loadFileVals1);

    this.validateCompDetails();
  }


  onSlideValChange(event,record: CompressorDetailUIModel) {
    record['isEnabled']=event.checked;
    record.enabled=event.checked;
    this.collectorName="collector";
  if(event.checked==true)
  {
    this.selCollector=true;
    this.dataSource.data.forEach(row => {

      console.log(row.compId," event vals is",record.compId)
      if(row.compId==record.compId)
      {
      row.collector = true;
     this.updateDataList(this.selCollector,this.collectorName,row.compId)
      }
    });
  }
  if(event.checked==false)
  this.selCollector=false;
  { this.dataSource.data.forEach(row => {
    if(row.compId==record.compId)
    {
      row.collector = false;
     this.updateDataList(this.selCollector,this.collectorName,row.compId)
    }
  });
  }
  this.validateCompDetails();
  console.log(this.dataSource.data)
  }
  thetaValueChange(e,type){
    
    this.dataSource.data.forEach(row => {
      if(row.compType == type){
        row.value = e.target.value ? e.target.value:"";
        
      }      
    });
    //this.valueStatus=true;
////console.log("theata change is ",event"and status is",this.valueStatus);
    this.validateCompDetails();
  
  }
  
  onPSChange(e,type){

    if(e.checked){
    this.dataSource.data.forEach(row => {
      if(row.compType == type){
        row.productStructre=e.checked;
      }
    });
  }
  else{
    this.dataSource.data.forEach(row => {
      if(row.compType == type){
        row.productStructre=e.checked;

      }
    });
  }

  //this.validateCompDetails();

  }
  onValueChangePos(){
    this.validateCompDetails();
  }
  onValueChangeOutlet(){
    this.validateCompDetails();
  }

  onEnded(record:CompressorDetailUIModel)
{
  this.validateCompDetails();
}
  // setDisplayColumn(record: CompressorDetailUIModel) {
  //   if (record.checked) {
  //     if (record.startAngle === 'Manual') {
  //       this.displayedColumns = ['id', 'compType', 'name', 'portionsDetails','ps', 'position', 'outlet', 'collector', 'startAngle', 'value'];
  //     }
  //     else {
  //       this.displayedColumns = ['id', 'compType', 'name', 'portionsDetails','ps', 'position', 'outlet', 'collector', 'startAngle'];

  //     }
  //   }
  //   else {
  //     if (record.startAngle === 'Manual') {
  //       this.displayedColumns = ['id', 'compType', 'name','ps', 'position', 'outlet', 'collector', 'startAngle', 'value'];
  //     }
  //     else {
  //       this.displayedColumns = ['id', 'compType', 'name','ps', 'position', 'outlet', 'collector', 'startAngle'];

  //     }
  //   }
  // }
  setDisplayColumn(record: CompressorDetailUIModel) {
    if (record.checkedStatus) {
      this.displayedColumns = ['id', 'compType', 'name', 'portionsDetails','ps', 'position', 'outlet', 'collector', 'startAngle'];
    }
    else {
      this.displayedColumns = ['id', 'compType', 'name','ps', 'position', 'outlet', 'collector', 'startAngle'];
    }
  }

  // resetCompressorDetail() {
  //   if (this.editMode) {
  //     //console.log('editmode',this.editMode);
  //     this.compressorList = JSON.parse(JSON.stringify(this.data));
  //     this.dataSource = new MatTableDataSource(this.compressorList);
  //   } else {
  //     //console.log('not edit mode')
  //     if (this.isAllSelected()) {
  //       this.dataSource.data.forEach(row => {
  //         //console.log(row)
  //         row.checked = false;
  //         row.portion.forEach(item => item.checked = false);


  //       });

  //       this.selection.clear()
  //     }
  //   }
  //   this.validateCompDetails();
  // }

  // Validate 
  resetCompressorDetail() {
    if (this.editMode) {
      this.compressorList = JSON.parse(JSON.stringify(this.data));
      this.dataSource = new MatTableDataSource(this.compressorList);

      this.dataSource.data.forEach(row => {
        row.checkedStatus = false;
        row.portion.forEach(item => item.checked = false);
        row.position = null;
        row.outlet = null;
        row.value = null;
        row.startAngle = null;
        row.collector = null;
        // this.selected =false;
        this.selection.clear();
      });


    } else {
      // this.compressorList = JSON.parse(JSON.stringify(this.data));
      // this.dataSource = new MatTableDataSource(this.compressorList);

      console.warn('not edit mode')

    }
    this.validateCompDetails();
  }


  validateCompDetails() {

    let recordCount = 0;
    let invalidCount = 0;
    this.dataSource.data.forEach((comp) => {
      
      if (comp && comp.checkedStatus) {
        recordCount++;
        
        if (!comp.position) {
          invalidCount++;
        }
        if (!comp.outlet)
        {
          invalidCount++;
        }
        
        if (!comp.collector && !comp.startAngle) 
        {
          invalidCount++;
        }
        if(!comp.collector)
        {
        if(comp.startAngle=="Manual"){
          
          if(!comp.value){
            invalidCount++;
          }
      }}
      
      }
    });

    if (recordCount > 0 && invalidCount === 0) {
      this.onCompDataChange.emit({
        valid: true,
        data: this.dataSource.data
      });
    } else {
      this.onCompDataChange.emit({
        valid: false,
        data: []
      });
    }
  }

  onResetBtnClick() {

    this.utilityService.setRunButton(false);
    this.selCollector=false;
      this.loadFileVals1=[];
      this.utilityService.getLoadFilesData(this.loadFileVals1);

      this.utilityService.setLoadFilesButton(false);
      this.utilityService.setLoadStstus(false);
      sessionStorage.clear();

    if (!this.editMode) {

      ////console.log(this.dataSource.data)

      //updated on 1/3/2022
      this.compressorList = JSON.parse(JSON.stringify(this.data));
      this.dataSource = new MatTableDataSource(this.compressorList);
      this.dataSource.data.forEach(row => {
        row.checkedStatus = false;


        row.portion.forEach(item => item.checked = false);
        row.position = null;
        row.outlet = null;

        row.value = null;
        row.productStructre=null;
        row.startAngle = null;
        row.collector = null;
        // this.selection.toggle();
        // this.selected=false;
        this.selection.clear();

      });
      
    }
    else {

      this.resetCompressorDetail();
      this.utilityService.setLoadFilesButton(false);
      this.utilityService.setLoadStstus(false);

    }
    this.validateCompDetails();
  }

    
  ngOnInit(): void {


    this.utilityService.nonCurrentUser$.subscribe(data => {
      this.dataUserStatus = data;
    });
    
    this.compressorList = JSON.parse(JSON.stringify(this.data));
    this.dataSource = new MatTableDataSource(this.compressorList);
    this.dataSource.data.forEach((record) => {
      if (record.checkedStatus) {
        this.selection.select(record);
        this.setDisplayColumn(record);
      }
      if(record.startAngle=="Manual")
      {
        this.st=1

      }

      if (this.editMode) {
        if(record.collector)
        {
          record['isEnabled1']=true;
        }
        else{
          record['isEnabled1']=false;
        }
        if(record.checkedStatus)
        {
          record.portion.forEach(element=>{
            if(element.checked)
            {
              this.loadFileVals1.push({compressor: record.compType, portion: element.name })
            }
          })
        }
      }
      })
      this.utilityService.getLoadFilesData(this.loadFileVals1);
  if(this.st>0)
    {
      this.displayedColumns.push("value")
    }
    
    this.validateCompDetails();
  }

}


export interface CompressorData {
  valid: boolean;
  data: CompressorDetailUIModel[];
}