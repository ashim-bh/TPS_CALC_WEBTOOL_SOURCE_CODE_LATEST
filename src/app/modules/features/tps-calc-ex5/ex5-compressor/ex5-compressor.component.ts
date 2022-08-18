import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { UtilityService } from '@core/services/utility.service';


import { FormArray, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';


import { JobRecordUIModel } from '@core/models/JobRecordUIModel';
import { Ex5CompressorDetailUIModel } from '@core/models/Ex5CompressorDetailUIModel';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { analyzeAndValidateNgModules } from '@angular/compiler';
//import { NotificationComponent } from '@shared/dialog/notification/notification.component';
import { NotificationComponent, tpsL1L2Data } from '@shared/dialog/notification/notification.component';





@Component({
  selector: 'tps-ex5-compressor',
  templateUrl: './ex5-compressor.component.html',
  styleUrls: ['./ex5-compressor.component.scss']
})
export class Ex5CompressorComponent implements OnInit {
  @Input() data: [Ex5CompressorDetailUIModel];
  @Input() editMode: boolean;
  @Output() onCompDataChange: EventEmitter<CompressorData> = new EventEmitter<CompressorData>();


  displayedColumns = ['id', 'compType', 'name', 'sealtype', 'L1', 'L2', 'JBavg'];
  compressorList;
  dataSource: MatTableDataSource<Ex5CompressorDetailUIModel>;
  selection = new SelectionModel<Ex5CompressorDetailUIModel>(true, []);
  row: any;
  value: any;
  element: any;
  showImage: boolean;
  showImg: boolean;
  seal: null;
  hl1: null;
  hl2: null;
  Jbavg: null;
  compType: string;
  dataValidStatus: boolean;
  dataUserStatus: boolean;
  l1: string;
  l2: string;
  //noCheck:number;
loadFileValsEx5 = new Map<string, number>();
loadFilesEnabled: boolean;
  runButtonStatus: boolean;

  //message: string;

  loadFileValsEx51 = new Array<{compressor: any}>();
  noCheck: number;
  blSealType: boolean;
  st: number=0;




  constructor(private utilityService: UtilityService, public dialog: MatDialog) {

  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  imageClick() {

    this.showImage = true;

  }

  imageBtnClick() {
    this.showImage = false;
  }
  lImageClick() {
    this.showImg = true;
  }
  lImageBtnClick() {
    this.showImg = false;
  }
  //  keyPressNumbersWithDecimal(event) {
  //   var charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode != 46 && charCode > 31
  //     && (charCode < 48 || charCode > 57)) {
  //     event.preventDefault();
  //     return false;

  //   }
  //   this.message="Only numbers with decimal are allowed";
  //   return true;
  // }



  masterToggle() {
    
    if (this.displayedColumns.includes('sealtemperature')) {
      this.displayedColumns = ['id', 'compType', 'name', 'sealtype', 'sealtemperature', 'L1', 'L2', 'JBavg'];
    }
    else {
      this.displayedColumns = ['id', 'compType', 'name', 'sealtype', 'L1', 'L2', 'JBavg'];
    }


    if (this.isAllSelected()) {
      
      this.dataSource.data.forEach(record => {
        record.checkedStatus = false;
        

        if (this.displayedColumns.includes('sealtemperature')) {
          this.displayedColumns = ['id', 'compType', 'name', 'sealtype', 'sealtemperature', 'L1', 'L2', 'JBavg'];
        }
        else {
          this.displayedColumns = ['id', 'compType', 'name', 'sealtype', 'L1', 'L2', 'JBavg'];

        }
        this.loadFileValsEx51.pop();
      });
      this.loadFilesEnabled = false;
      this.utilityService.setLoadFilesButton(this.loadFilesEnabled);
      this.selection.clear();
    }
    else {
      this.dataSource.data.forEach(row => {
        this.utilityService.setLoadFilesButton(true);
        row.checkedStatus = true;

        this.selection.select(row);
        if (this.displayedColumns.includes('sealtemperature')) {
          this.displayedColumns = ['id', 'compType', 'name', 'sealtype', 'sealtemperature', 'L1', 'L2', 'JBavg'];
        }
        else {
          this.displayedColumns = ['id', 'compType', 'name', 'sealtype', 'L1', 'L2', 'JBavg'];

        }
        this.loadFileValsEx51.push({compressor: row.compType});
      });
      this.loadFilesEnabled = true;
      this.utilityService.setLoadFilesButton(this.loadFilesEnabled);
    }
    this.utilityService.getLoadFilesEx5Data(this.loadFileValsEx51);
    this.validateCompDetails();


  }
  onRowChecked(record: Ex5CompressorDetailUIModel, event: MatCheckboxChange) {
    
    record.checkedStatus = event.checked;
    this.noCheck=0;
    
    this.selection.toggle(record);
    //console.log(record, 'type is', record.compType)
    if (record.checkedStatus == true) 
    {      
      this.loadFileValsEx51.push({compressor:record.compType});
      }
    if (record.checkedStatus == false) {
      //updated on 18/05/2022
      //console.log("unchecked in ",this.loadFileValsEx51)
    
      var numArr=new Array;
      this.loadFileValsEx51.forEach(element=>{
        if(element.compressor===record.compType)
        {
         numArr.push(this.loadFileValsEx51.indexOf(element))
          // this.loadFileVals1.splice(this.loadFileVals1.indexOf(element),1);      
        }
      });
      numArr=numArr.sort((a, b) => b-a)
      for(let i=0;i<numArr.length; i++)
      {
          this.loadFileValsEx51.splice(numArr[i],1);
      }
    }
    if (this.loadFileValsEx51.length==0) 
    {
      this.loadFilesEnabled = false;
      this.utilityService.setLoadFilesButton(this.loadFilesEnabled);
    }
    else {
      this.loadFilesEnabled = true;
      this.utilityService.setLoadFilesButton(this.loadFilesEnabled);
      // this.utilityService.getLoadFilesEx5Data(this.loadFileValsEx5);
      // this.utilityService.setLoadStstus(true);
    }
    this.utilityService.getLoadFilesEx5Data(this.loadFileValsEx51);
    this.validateCompDetails();
  }
  setDisplayColumn(record: Ex5CompressorDetailUIModel) {
    if (record.checkedStatus) {
      this.displayedColumns = ['id', 'compType', 'name', 'sealtype', 'sealtemperature', 'L1', 'L2', 'JBavg'];
    }
    else {
      this.displayedColumns = ['id', 'compType', 'name', 'sealtype', 'sealtemperature', 'L1', 'L2', 'JBavg'];
    }
    // this.validateCompressor();
  }
  onValueChange(record: Ex5CompressorDetailUIModel,type) {
    let countval=0;
    //console.log(record,"record is");
    //console.log(type,"row is");
    if (record.sealType === 'Custom deg c') {
      record.enabled=true;
      record['isEnabled']=true;
      this.blSealType=true;

      
     this.displayedColumns = ['id', 'compType', 'name', 'sealtype', 'sealtemperature', 'L1', 'L2', 'JBavg']
     // this.displayedColumns.push("sealtemperature");
    }
    else {
      record['isEnabled']=false;
      this.blSealType=false;
      record.enabled=false;

      this.dataSource.data.forEach(item=>{
        if(item.sealType!="Custom deg c")
        {
          countval++;
        }
      })
      if(countval==this.dataSource.data.length)
      {
        this.displayedColumns = ['id', 'compType', 'name', 'sealtype', 'L1', 'L2', 'JBavg']
      }
    }
    this.validateCompDetails();
    //this.validateCompressor();
  }
  // myFunction(){
  //   const imageSrc = 'assets/images/iphone.png'  
  // }

  resetCompressorDetail() {
    if (this.editMode) {
      //console.log('editmode', this.editMode);
      this.compressorList = JSON.parse(JSON.stringify(this.data));
      this.dataSource = new MatTableDataSource(this.compressorList);

      this.dataSource.data.forEach(row => {
        //console.log(row);

        row.checkedStatus = false;

        row.sealType = null;
        row.sealTemperature = null;
        row.heightOfAwayfromkey = null;
        row.heightOfsupportnearkey = null;
        row.jbavg = null;

        // this.selected =false;
        this.selection.clear();
      });


    } else {
      this.utilityService.setRunButton(false);
      // this.compressorList = JSON.parse(JSON.stringify(this.data));
      // this.dataSource = new MatTableDataSource(this.compressorList);

      console.warn('not edit mode')

    }
    this.validateCompDetails();
  }
  onResetBtnClick() {
    this.utilityService.setRunButton(false);
    this.loadFileValsEx51=[];
    this.utilityService.getLoadFilesEx5Data(this.loadFileValsEx51);

    this.utilityService.setLoadStstus(false);
    this.utilityService.setLoadFilesButton(false);
    this.displayedColumns = ['id', 'compType', 'name', 'sealtype', 'L1', 'L2', 'JBavg'];

    if (!this.editMode) {
      ////console.log(this.dataSource.data)
      //updated on 1/3/2022
      this.compressorList = JSON.parse(JSON.stringify(this.data));
      this.dataSource = new MatTableDataSource(this.compressorList);
      this.dataSource.data.forEach(row => {
        row.checkedStatus = false;
        //console.log(row);

        row.sealType = null;
        row.sealTemperature = null;
        row.heightOfAwayfromkey = null;
        row.heightOfsupportnearkey = null;
        row.jbavg = null;
        // this.selection.toggle();
        // this.selected=false;
        this.selection.clear();

      });
      

    }
    else {
      this.loadFileValsEx51.pop();
      this.utilityService.setLoadFilesButton(false);
      this.utilityService.setLoadStstus(false);

      this.resetCompressorDetail();
      // this.utilityService.setRunButton(false);

    }
    this.validateCompDetails();
  }

  


  // setDisplayColumn(record: Ex5CompressorDetailUIModel) {
  //   if (record.checked) {
  //     this.displayedColumns = ['id', 'compType', 'name', 'portionsDetails', 'position', 'outlet', 'collector', 'startAngle'];
  //   }
  //   else {
  //     this.displayedColumns = ['id', 'compType', 'name', 'position', 'outlet', 'collector', 'startAngle'];
  //   }
  // }
  validateCompDetails() {

    let recordCount = 0;
    let invalidCount = 0;
    this.dataSource.data.forEach((comp) => {
      //console.log(comp, 'and it is ', comp.sealType, comp.checkedStatus)
      if (comp && comp.checkedStatus) {
        recordCount++;

        if (!comp.sealType) {
          
          invalidCount++;
        }
        if(this.displayedColumns.includes('sealtemperature')){
          if(comp.sealType=="Custom deg c")
          {
            if (!comp.sealTemperature) {
              invalidCount++;
            }
          }
        
      }
        if(!comp.heightOfAwayfromkey){
          invalidCount++;
        }
        if(!comp.heightOfsupportnearkey){
          invalidCount++;
        }
        if(!comp.jbavg){
          invalidCount++;
        }
      }
    
    });
    //console.log("counts are,", recordCount, invalidCount)
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
  // validateCompressor(){
  //   if(this.row.L1 && this.row.L2 && this.row.JBavg){

  //     this.utilityService.setSaveButton(this.dataValidStatus);
  //     this.dataValidStatus=false;
  //   }
  // }
  valCheckL1() {
    //console.log("pointer out");
  }
  imageOnClick(event: Event) {
    //console.log('image click', event);
    window.open("C:\Users\gunahar\Downloads\TPS-CALC-Webtool-Source-Code-05May Latest (1)\src\assets\compressor\h1image.png")

  }
  windowOpen() {
    var img = window.open("C:\Users\gunahar\Downloads\TPS-CALC-Webtool-Source-Code-05May Latest (1)\src\assets\compressor\h1image.png", "_blank", "width 500");
  }


  onL1L2Image(dataL1: string) {
    //console.log(dataL1)
    const dialogData: tpsL1L2Data = {
      customTemplate: false,
      modalContent: dataL1,
      primaryBtnText: 'ok',
      modalTitle: ''
    }
    const dialogRef = this.dialog.open(NotificationComponent, { data: dialogData });
    dialogRef.afterClosed().subscribe(res => {
      //console.log(`Dialog result: ${res}`);
    });
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
      if(record.sealType=="Custom deg c")
      {
        this.st=1
      }
      
      if (this.editMode) {
        if(record.checkedStatus)
        {
          this.loadFileValsEx51.push({compressor: record.compType})
        }
      }
    })
    if(this.st>0)
    {
      this.displayedColumns=['id', 'compType', 'name', 'sealtype', 'sealtemperature', 'L1', 'L2', 'JBavg'];
    }
    else
    {
      this.displayedColumns=['id', 'compType', 'name', 'sealtype', 'L1', 'L2', 'JBavg'];

    }
    this.utilityService.getLoadFilesEx5Data(this.loadFileValsEx51);

    this.validateCompDetails();
  }
  l1Click(e,type){

    //console.log(e);
    //console.log(e.target.value);
    this.dataSource.data.forEach(row => {
      if(row.compType == type){
        
          row.heightOfsupportnearkey= e.target.value ? e.target.value:"";
        
      }
      
      
    });
    this.validateCompDetails();
    
  }
  onTemp(e,type){
    //console.log(e.target.value);
    this.dataSource.data.forEach(row => {
      if(row.compType == type){
        
          row.sealTemperature= e.target.value ? e.target.value:"";
        
       
       
        
      }
      
      
    });
    this.validateCompDetails();
    
  
  }
  l2Click(e,type){
    this.dataSource.data.forEach(row => {
      if(row.compType == type){
        
          row.heightOfAwayfromkey= e.target.value ? e.target.value:"";
        
       
      }
      
      
    });
    this.validateCompDetails();
    
  
  }
  jbClick(e,type){
    this.dataSource.data.forEach(row => {
      if(row.compType == type){
        
          row.jbavg= e.target.value ? e.target.value:"";
        
       
       
        
      }
      
      
    });
    this.validateCompDetails();
  }

}
export interface CompressorData {
  valid: boolean;
  data: Ex5CompressorDetailUIModel[];
}











