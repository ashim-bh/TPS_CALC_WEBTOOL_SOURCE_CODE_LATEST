import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { JobRecordUIModel } from '@core/models/JobRecordUIModel';
import { loadFilesModelData } from '@core/models/loadFilesModel';
import { UtilityService } from '@core/services/utility.service';
import { TpsDialogComponent, tpsDialogData } from '@shared/dialog/components/tps-dialog.component';

@Component({
  selector: 'tps-cal55-load-files',
  templateUrl: './cal55-load-files.component.html',
  styleUrls: ['./cal55-load-files.component.scss']
})
export class Cal55LoadFilesComponent implements OnInit {

  @Input() data1: loadFilesModelData[];

  @ViewChild('fileUpload1')fileUpload1: ElementRef; 
  @ViewChild('fileUpload2')fileUpload2: ElementRef;
  @ViewChild('fileUpload3')fileUpload3: ElementRef;
  @ViewChild('fileUpload4')fileUpload4: ElementRef;
  @ViewChild('fileUpload5')fileUpload5: ElementRef;
  @ViewChild('fileUpload6')fileUpload6: ElementRef;
  @ViewChild('fileUpload7')fileUpload7: ElementRef;
  @ViewChild('fileUpload8')fileUpload8: ElementRef;
  @ViewChild('fileUpload9')fileUpload9: ElementRef;
  @ViewChild('fileUpload10')fileUpload10: ElementRef;
  @ViewChild('fileUpload11')fileUpload11: ElementRef;
  @ViewChild('fileUpload12')fileUpload12: ElementRef;
  
  loadfilesFormGroup: FormGroup;
  staLocCo1P1:string;staLocCo1P2:string;staLocCo1P3:string;
  staLocCo2P1:string;staLocCo2P2:string;staLocCo2P3:string;
  staLocCo3P1:string;staLocCo3P2:string;staLocCo3P3:string;

  studyLocCo1:string;studyLocCo2:string;studyLocCo3:string;

  Comp1:string;Comp2:string;Comp3:string;
  loadfilesFormGroupStat:boolean;
  showImg:boolean;
  valid=false;
  count=0;
  dataCount=0;
  filecount=0;
  compArr:any[];
  portArr:any[];
  // loadFileValues = new Map<string, number>();

  loadFileValues1 = new Array<{compressor: any, portion: any}>();

  loadFilePortions = new Map<string, boolean>();
  loadFileVaues;
  dataSource: MatTableDataSource<loadFilesModelData>;

  dataUserStatus: boolean;

  currentJob: JobRecordUIModel;
  Filepath:loadFilesModelData[];

  staC1p1=false; staC1p2=false;staC1p3=false;
  staC2p1=false; staC2p2=false; staC2p3=false;
  staC3p1=false; staC3p2=false; staC3p3=false;
  studyCo1=false; studyCo2=false; studyCo3=false;
  filePaths: loadFilesModelData[];
  Comp1p1: string;Comp1p2: string;Comp1p3: string;
  Comp2p1: string;Comp2p2: string;Comp2p3: string;
  Comp3p1: string;Comp3p2: string;Comp3p3: string;
  filepaths = new Array<{staLocCo1P1:string,staLocCo1P2:string,staLocCo1P3:string,staLocCo2P1:string,staLocCo2P2:string,staLocCo2P3:string,staLocCo3P1:string,staLocCo3P2:string,staLocCo3P3:string,
    stdLocCo1:string,stdLocCo2:string,stdLocCo3:string}>();
    loadmode=false;

    c1p1Valid:boolean;c1p2Valid:boolean;c1p3Valid:boolean;
    c2p1Valid:boolean;c2p2Valid:boolean;c2p3Valid:boolean;
    c3p1Valid:boolean;c3p2Valid:boolean;c3p3Valid:boolean;
    C1Valid:boolean;C2Valid:boolean;C3Valid:boolean;
  errorMessage: any;

  constructor(public dialogRef:MatDialogRef<Cal55LoadFilesComponent>,private utilityService:UtilityService,private fb: FormBuilder,public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: loadFilesData){}
  @Input() editMode: boolean;

  ngOnInit(): void {
    this.loadmode=false;

   
    this.createFormGroup();

   // this.dataSource =new MatTableDataSource<loadFilesModelData>();
    this.utilityService.setLoadStstus(false);
    this.loadfilesFormGroupStat=false;
    const jobId = this.data.id;
    this.loadFileVaues = this.data1;
    //this.dataSource = new MatTableDataSource(this.loadFileVaues);
   //added by harini
    this.utilityService.nonCurrentUser$.subscribe(userData => {
      this.dataUserStatus = userData;
    });

    this.loadfilesFormGroupStat=false;
    if(!this.data.editMode){
    this.utilityService.getDetails$.subscribe(data => {
     
      this.loadFileValues1=data
   
    }) }
 
      
      this.loadFileValues1.forEach(item => {

        if(item.compressor=="Compressor 1")
        {
          if(!this.studyCo1)
          {
          this.studyCo1=true;
          this.filecount++;
          }
          if(item.portion=="Portion-1"){

            this.staC1p1=true; this.filecount++; 
          }
          else if(item.portion=="Portion-2"){
            
          this.staC1p2=true; this.filecount++;
          }
          else if(item.portion=="Portion-3"){
          
            this.staC1p3=true; this.filecount++;
          }
        }
        if(item.compressor=="Compressor 2")
        {
          if(!this.studyCo2)
          {
          this.studyCo2=true;
          this.filecount++;
          }
          if(item.portion=="Portion-1"){
            this.staC2p1=true; this.filecount++; 
          }
          else if(item.portion=="Portion-2"){
            this.staC2p2=true; this.filecount++;
          }
          else if(item.portion=="Portion-3"){
            this.staC2p3=true; this.filecount++;
          }
        }
        if(item.compressor=="Compressor 3")
        {
          if(!this.studyCo3)
          {
          this.studyCo3=true;
          this.filecount++;
          }
          if(item.portion=="Portion-1"){
            this.staC3p1=true; this.filecount++; 
          }
          else if(item.portion=="Portion-2"){
            //this.staC3p1=true; this.filecount++; 
            this.staC3p2=true; this.filecount++;
          }
          else if(item.portion=="Portion-3"){
            this.staC3p3=true; this.filecount++;
          }
        }
      
    });

    //added by ashim for edit mode
    if(this.data.editMode)
    {
      this.filecount=0;

      this.loadmode=true;

      this.fillDataByJobId(jobId);
      this.loadfilesFormGroupStat=true;
      this.utilityService.getDetails$.subscribe(dataitems => {
     
        this.loadFileValues1=dataitems
      })

      this.loadFileValues1.forEach(item => {

        if(item.compressor=="Compressor 1")
        {
          if(!this.studyCo1)
          {
          this.studyCo1=true;
          this.filecount++;
          }
          if(item.portion=="Portion-1"){

            this.staC1p1=true; this.filecount++; 
          }
          else if(item.portion=="Portion-2"){
            
          this.staC1p2=true; this.filecount++;
          }
          else if(item.portion=="Portion-3"){
          
            this.staC1p3=true; this.filecount++;
          }
        }
        if(item.compressor=="Compressor 2")
        {
          if(!this.studyCo2)
          {
          this.studyCo2=true;
          this.filecount++;
          }
          if(item.portion=="Portion-1"){
            this.staC2p1=true; this.filecount++; 
            //this.staC2p2=true; this.filecount++; this.staC2p3=true; this.filecount++;
          }
          else if(item.portion=="Portion-2"){
           // this.staC2p1=true; this.filecount++; 
            this.staC2p2=true; this.filecount++;
          }
          else if(item.portion=="Portion-3"){
            this.staC2p3=true; this.filecount++;
          }
        }
        if(item.compressor=="Compressor 3")
        {
          if(!this.studyCo3)
          {
          this.studyCo3=true;
          this.filecount++;
          }          if(item.portion=="Portion-1"){
            this.staC3p1=true; this.filecount++; 
            //this.staC3p2=true; this.filecount++; this.staC3p3=true;
          }
          else if(item.portion=="Portion-2"){
            //this.staC3p1=true; this.filecount++; 
            this.staC3p2=true; this.filecount++;
          }
          else if(item.portion=="Portion-3"){
            this.staC3p3=true; this.filecount++;
          }
        }
      
    });
    }
    
    else{
      

    var storedFilepath = JSON.parse(sessionStorage.getItem("load_filepath")); 
      if(storedFilepath)
      {
        this.staLocCo1P1=storedFilepath[0];this.staLocCo1P2=storedFilepath[1];this.staLocCo1P3=storedFilepath[2];
        this.staLocCo2P1=storedFilepath[3];this.staLocCo2P2=storedFilepath[4];this.staLocCo2P3=storedFilepath[5];
        this.staLocCo3P1=storedFilepath[6];this.staLocCo3P2=storedFilepath[7];this.staLocCo3P3=storedFilepath[8];
        this.studyLocCo1=storedFilepath[9];this.studyLocCo2=storedFilepath[10];this.studyLocCo3=storedFilepath[11];
        
      }
    
    else{
    this.staLocCo1P1=null;
    this.staLocCo1P2=null;this.staLocCo1P3=null;
    this.staLocCo2P1=null;this.staLocCo2P2=null;this.staLocCo2P3=null;
    this.staLocCo3P1=null;this.staLocCo3P2=null;this.staLocCo3P3=null;
    this.studyLocCo1=null;this.studyLocCo2=null;this.studyLocCo3=null;
    }
    storedFilepath.forEach(element => {
    if(element!=null)
   this.count++;
    });

    if(this.count>=this.filecount)
    {
      this.loadfilesFormGroupStat=true;
    }  
  }
  if (this.count >= this.filecount) {
    this.loadfilesFormGroupStat = true;
  }
  else{
    this.loadfilesFormGroupStat = false;

  }}

  hideloader() {
  
    // Setting display of spinner
    // element to none
    document.getElementById('loading').style.display = 'none';
}

//added for edit mode
  fillDataByJobId(jobId) {
    this.count=0;


    const jobEdit = 'http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/calc/get-by-jobId/' + jobId + ',2';
    const subscription1 = this.utilityService.getJobListEdit(jobEdit).subscribe(data => {
   
    //const subscription = this.utilityService.getJobList().subscribe(data => {
      if (data) {
        this.hideloader();
        this.currentJob = data;
        this.loadmode=false;

        this.filePaths=this.currentJob.filePath;
        this.filePaths.forEach(element => {
           this.Comp1=element.stdLocCo1;
           this.Comp2=element.stdLocCo2;
           this.Comp3=element.stdLocCo3;
           this.Comp1p1=element.staLocCo1P1;
           this.Comp1p2=element.staLocCo1P2;
           this.Comp1p3=element.staLocCo1P3;
           this.Comp2p1=element.staLocCo2P1;
           this.Comp2p2=element.staLocCo2P2;
           this.Comp2p3=element.staLocCo2P3;
           this.Comp3p1=element.staLocCo3P1;
           this.Comp3p2=element.staLocCo3P2;
           this.Comp3p3=element.staLocCo3P3;

          
        });
          this.currentJob.compressorDetails.forEach(element => {
          if(element.checkedStatus)
          {
            if(element.compType.toLowerCase()=="compressor 1")
            {
              this.studyLocCo1=this.Comp1;
              this.count++;

              element.portion.forEach(element1 => {
                if(element1.name.toLowerCase()=="portion-1")
                {
                  if(element1.checked)
                  {
                    this.staLocCo1P1=this.Comp1p1;
                    this.count++;
                  }
                }
                if(element1.name.toLowerCase()=="portion-2")
                {
                  if(element1.checked)
                  {
                  this.staLocCo1P2=this.Comp1p2;
                  this.count++;
                  }
                }
                if(element1.name.toLowerCase()=="portion-3")
                {
                  if(element1.checked)
                  {
                  this.staLocCo1P3=this.Comp1p3;
                  this.count++;
                  }
                }
                
              });
            }
            if(element.compType.toLowerCase()=="compressor 2")
            {
              this.studyLocCo2=this.Comp2;
              this.count++;

              element.portion.forEach(element1 => {
                if(element1.name.toLowerCase()=="portion-1")
                {
                  if(element1.checked)
                  {
                  this.staLocCo2P1=this.Comp2p1;
                  this.count++;
                  }
                }
                if(element1.name.toLowerCase()=="portion-2")
                {
                  if(element1.checked)
                  {
                  this.staLocCo2P2=this.Comp2p2;
                  this.count++;
                  }
                }
                if(element1.name.toLowerCase()=="portion-3")
                {
                  if(element1.checked)
                  {
                  this.staLocCo2P3=this.Comp2p3;
                  this.count++;
                  }
                }
                
              });
            }
            if(element.compType.toLowerCase()=="compressor 3")
            {
              this.studyLocCo3=this.Comp3;
              this.count++;

              element.portion.forEach(element1 => {
                if(element1.name.toLowerCase()=="portion-1")
                {
                  if(element1.checked)
                  {
                  this.staLocCo3P1=this.Comp3p1;
                  this.count++;
                  }
                }
                if(element1.name.toLowerCase()=="portion-2")
                {
                  if(element1.checked)
                  {
                  this.staLocCo3P2=this.Comp3p2;
                  this.count++;
                  }
                }
                if(element1.name.toLowerCase()=="portion-3")
                {
                  if(element1.checked)
                  {
                  this.staLocCo3P3=this.Comp3p3;
                  this.count++;
                  }
                }
                
              });
            }
          }
          
        });
      }
      if (this.count >= this.filecount) {
        this.loadfilesFormGroupStat = true;
      }
      else{
        this.loadfilesFormGroupStat = false;
  
      }
    },
    (error) => {//Error callback
     console.error('error caught in component')
     this.errorMessage = error;

     alert(this.errorMessage.error.message+",Error in Loading datd,please try again")

   });
  }

  createFormGroup() {
      this.loadfilesFormGroup = this.fb.group({
      staLocCo1Po1: new FormControl('', Validators.required),staLocCo1Po2: new FormControl('', Validators.required),staLocCo1Po3: new FormControl('', Validators.required),
      staLocCo2Po1: new FormControl('', Validators.required),staLocCo2Po2: new FormControl('', Validators.required),staLocCo2Po3: new FormControl('', Validators.required),
       staLocCo3Po1: new FormControl('', Validators.required),staLocCo3Po2: new FormControl('', Validators.required),staLocCo3Po3: new FormControl('', Validators.required),
      studyLocCoPrt1: new FormControl('', Validators.required),studyLocCoPrt2: new FormControl('', Validators.required),studyLocCoPrt3: new FormControl('', Validators.required),
     
    });
  }
  onSaveBtnClick()
  {
    this.filepaths.push({staLocCo1P1:this.staLocCo1P1,staLocCo1P2:this.staLocCo1P2,staLocCo1P3:this.staLocCo1P3,
      staLocCo2P1: this.staLocCo2P1,staLocCo2P2:this.staLocCo2P2,staLocCo2P3:this.staLocCo2P3,
      staLocCo3P1: this.staLocCo3P1,staLocCo3P2:this.staLocCo3P2,staLocCo3P3:this.staLocCo3P3,
      stdLocCo1:this.studyLocCo1,stdLocCo2:this.studyLocCo2,stdLocCo3:this.studyLocCo3});

      var filePaths = [this.staLocCo1P1,this.staLocCo1P2,this.staLocCo1P3,
      this.staLocCo2P1,this.staLocCo2P2,this.staLocCo2P3,
      this.staLocCo3P1,this.staLocCo3P2,this.staLocCo3P3,
      this.studyLocCo1,this.studyLocCo2,this.studyLocCo3];

    sessionStorage.setItem("load_filepath", JSON.stringify(filePaths));
    sessionStorage.setItem("load_filepath_save", JSON.stringify( this.filepaths)); //store colors
    //store colors
    //localStorage.setItem('dataSource', ); // setting

    this.utilityService.setLoadStstus(true);
    this.dialogRef.close();
  }


  onClick(event, data) {

    if (data == "Co1P1") {
      this.staLocCo1P1 = (event.target.value).replaceAll('"','');
      if (this.staLocCo1P1 && this.validateFile(this.staLocCo1P1, "Co1P1")) {
        this.loadfilesFormGroup.patchValue({
          staLocCo1Po1: this.staLocCo1P1
        });
        this.count++;
      }
      
    }
    else if (data == "Co1P2") {
      this.staLocCo1P2 = (event.target.value).replaceAll('"','');
      if (this.staLocCo1P2 && this.validateFile(this.staLocCo1P2, "Co1P2")) {
        this.loadfilesFormGroup.patchValue({
          staLocCo1Po2: this.staLocCo1P2
        });
        this.count++;
      }
    }
    else if (data == "Co1P3") {
      this.staLocCo1P3 = (event.target.value).replaceAll('"','');
      if (this.staLocCo1P3 && this.validateFile(this.staLocCo1P3, "Co1P3")) {
        this.loadfilesFormGroup.patchValue({
          staLocCo1Po3: this.staLocCo1P3
        });
        this.count++;
      }
    }
    else if (data == "Co2P1") {
      this.staLocCo2P1 = (event.target.value).replaceAll('"','');
      if (this.staLocCo2P1 && this.validateFile(this.staLocCo2P1, "Co2P1")) {
        this.loadfilesFormGroup.patchValue({
          staLocCo2Po1: this.staLocCo2P1
        });
        this.count++;
      }
    }
    else if (data == "Co2P2") {
      this.staLocCo2P2 = (event.target.value).replaceAll('"','');
      if (this.staLocCo2P2 && this.validateFile(this.staLocCo2P2, "Co2P2")) {
        this.loadfilesFormGroup.patchValue({
          staLocCo2Po2: this.staLocCo2P2
        });
        this.count++;
      }
    }
    else if (data == "Co2P3") {
      this.staLocCo2P3 = (event.target.value).replaceAll('"','');
      if (this.staLocCo2P3 && this.validateFile(this.staLocCo2P3, "Co2P3")) {
        this.loadfilesFormGroup.patchValue({
          staLocCo2Po3: this.staLocCo2P3
        });
        this.count++;
      }
    }
    else if (data == "Co3P1") {
      this.staLocCo3P1 = (event.target.value).replaceAll('"','');
      if (this.staLocCo3P1 && this.validateFile(this.staLocCo3P1, "Co3P1")) {
        this.loadfilesFormGroup.patchValue({
          staLocCo3Po1: this.staLocCo3P1
        });
        this.count++;
      }
    }
    else if (data == "Co3P2") {
      this.staLocCo3P2 = (event.target.value).replaceAll('"','');
      if (this.staLocCo3P2 && this.validateFile(this.staLocCo3P2, "Co3P2")) {
        this.loadfilesFormGroup.patchValue({
          staLocCo3Po2: this.staLocCo3P2
        });
        this.count++;
      }
    }
    else if (data == "Co3P3") {
      this.staLocCo3P3 = (event.target.value).replaceAll('"','');
      if (this.staLocCo3P3 && this.validateFile(this.staLocCo3P3, "Co3P3")) {
        this.loadfilesFormGroup.patchValue({
          staLocCo3Po3: this.staLocCo3P3
        });
        this.count++;
      }
    }
    else if (data == "prtCo1") {
      this.studyLocCo1 = (event.target.value).replaceAll('"','');
      if (this.studyLocCo1 && this.validateFilePrt(this.studyLocCo1, "prtCo1")) {
        this.loadfilesFormGroup.patchValue({
          studyLocCoPrt1: this.studyLocCo1
        });
        this.count++;
      }
    }
    else if (data == "prtCo2") {
      this.studyLocCo2 = (event.target.value).replaceAll('"','');
      if (this.studyLocCo2 && this.validateFilePrt(this.studyLocCo2, "prtCo2")) {
        this.loadfilesFormGroup.patchValue({
          studyLocCoPrt2: this.studyLocCo2
        });
        this.count++;
      }
    }
    else if (data == "prtCo3") {
      this.studyLocCo3 = (event.target.value).replaceAll('"','');
      if (this.studyLocCo3 && this.validateFilePrt(this.studyLocCo3, "prtCo3")) {
        this.loadfilesFormGroup.patchValue({
          studyLocCoPrt3: this.studyLocCo3
        });
        this.count++;
      }
    }

    if(this.count>=this.filecount)
  {
    this.loadfilesFormGroupStat=true;
  }
  }
  onInput(event){

  }
  // onFileSelected(event,data){
  //   //console.log("inside sta",data)
  //   const file: File = event.target.files[0];
  //   //console.log(file)

  //   if(data=="Co1P1"){
  //   if (file && this.validateFile(file,"Co1P1")) {
  //     this.staLocCo1P1 = event.path[0].value;
  //     this.loadfilesFormGroup.patchValue({
  //       staLocCo1Po1:event.path[0].value
  //     });this.count++;  
  //     // this.dataSource.data.forEach((record) => {
  //     //   record.strstaLocCo1P1=this.staLocCo1P1;
  //     // });
  //     //console.log(event, 'path is',event.path, event.filepath,event.filePath)
  //   }
    
  // }
  // if(data=="Co1P2"){
  //   if (file && this.validateFile(file,"Co1P2")) {
  //     this.staLocCo1P2 = event.path[0].value;
  //     this.loadfilesFormGroup.patchValue({
  //       staLocCo1Po2: event.path[0].value
  //     });this.count++;
  //     // this.dataSource.data.forEach((record) => {
    
  //     //   record.strstaLocCo1P2=this.staLocCo1P2;
  //     // });

  //   }
  // }
  // if(data=="Co1P3"){
  //   if (file && this.validateFile(file,"Co1P3")) {
  //     this.staLocCo1P3 = event.path[0].value;
  //     this.loadfilesFormGroup.patchValue({
  //       staLocCo1Po3: event.path[0].value
  //     });this.count++;
  //     // this.dataSource.data.forEach((record) => {
  //     //   record.strstaLocCo1P3=this.staLocCo1P3;
  //     // });
  //   }
  // }

  // if(data=="Co2P1"){
  //   if (file && this.validateFile(file,"Co2P1")) {
  //     this.staLocCo2P1 = event.path[0].value;
  //     this.loadfilesFormGroup.patchValue({
  //       staLocCo2Po1: event.path[0].value
  //     });this.count++;
  //     // this.dataSource.data.forEach((record) => {
  //     //   record.strstaLocCo2P1=this.staLocCo2P1;
  //     // });
  //   }
  // }
  // if(data=="Co2P2"){
  //   if (file && this.validateFile(file,"Co2P2")) {
  //     this.staLocCo2P2 = event.path[0].value;
  //     this.loadfilesFormGroup.patchValue({
  //       staLocCo2Po2: event.path[0].value
  //     });this.count++;
  //     // this.dataSource.data.forEach((record) => {
  //     //   record.strstaLocCo2P2=this.staLocCo2P2;
  //     // });
  //   }
  // }
  // if(data=="Co2P3"){
  //   if (file && this.validateFile(file,"Co2P3")) {
  //     this.staLocCo2P3 = event.path[0].value;
  //     this.loadfilesFormGroup.patchValue({
  //       staLocCo2Po3: event.path[0].value
  //     });this.count++;
  //   }

  //   // this.dataSource.data.forEach((record) => {
  //   //   record.strstaLocCo2P3=this.staLocCo2P3;
  //   // });
  // }

  // if(data=="Co3P1"){
  //   if (file && this.validateFile(file,"Co3P1")) {
  //     this.staLocCo3P1 = event.path[0].value;
  //     this.loadfilesFormGroup.patchValue({
  //       staLocCo3Po1: event.path[0].value
  //     });this.count++;
  //     // this.dataSource.data.forEach((record) => {
  //     //   record.strstaLocCo3P1=this.staLocCo3P1;
  //     // });
  //   }
  // }
  // if(data=="Co3P2"){
  //   if (file && this.validateFile(file,"Co3P2")) {
  //     this.staLocCo3P2 = event.path[0].value;
  //     this.loadfilesFormGroup.patchValue({
  //       staLocCo3Po2: event.path[0].value
  //     });this.count++;
  //     // this.dataSource.data.forEach((record) => {
  //     //   record.strstaLocCo3P2=this.staLocCo3P2;
  //     // });
  //   }
  // }
  // if(data=="Co3P3"){
  //   if (file && this.validateFile(file,"Co3P3")) {
  //     this.staLocCo3P3 = event.path[0].value;
  //     this.loadfilesFormGroup.patchValue({
  //       staLocCo3Po3: event.path[0].value
  //     });this.count++;
    
  //     // this.dataSource.data.forEach((record) => {
  //     //   record.strstaLocCo3P3=this.staLocCo3P3;
  //     // });
  //   }
  // }

  // if(data=="prtCo1"){
  //   if (file && this.validateFilePrt(file,"prtCo1")) {
  //     this.studyLocCo1 = event.path[0].value;
  //     this.loadfilesFormGroup.patchValue({
  //       studyLocCoPrt1: event.path[0].value
  //     });this.count++;
  //     // this.dataSource.data.forEach((record) => {
  //     //   record.strstudyLocCo1=this.studyLocCo1;
  //     // });

  //   }
  // }
  // if(data=="prtCo2"){
  //   if (file && this.validateFilePrt(file,"prtCo2")) {
  //     this.studyLocCo2 = event.path[0].value;
  //     this.loadfilesFormGroup.patchValue({
  //       studyLocCoPrt2: event.path[0].value
  //     });this.count++;
  //     // this.dataSource.data.forEach((record) => {
  //     //   record.strstudyLocCo2=this.studyLocCo2;
  //     // });
  //   }
  // //console.log(this.loadfilesFormGroup)
  // }
  // if(data=="prtCo3"){
  //   if (file && this.validateFilePrt(file,"prtCo3")) {
  //     this.studyLocCo3 = event.path[0].value;
  //     this.loadfilesFormGroup.patchValue({
  //       studyLocCoPrt3: event.path[0].value
  //     });
  //     this.count++;
  //     // this.dataSource.data.forEach((record) => {
  //     //   record.strstudyLocCo3=this.studyLocCo3;
  //     // });
  //   }
  // }

  // // for(let i=0;i<this.loadfilesFormGroup.value.length();i++)
  // // {
  // //   if(this.loadfilesFormGroup.value[i]!="")
  // //   {
  // //     this.dataCount++
  // //   }
    
  // // }
  // // //console.log(this.dataCount)

  
  // //console.log("count and equal",this.count,this.filecount)
  // if(this.count>=this.filecount)
  // {
  //   this.loadfilesFormGroupStat=true;
  // }

  // }
  validateFile(file: string,data: string) {
    
    const isFileValid = file.split('.')[1] === 'sta' ? true : false;
    if (isFileValid) {
      if (data == "Co1P1") {
        this.c1p1Valid=true;
      }
      else if (data == "Co1P2") {
        this.c1p2Valid=true;
      }
      else if (data == "Co1P3") {
        this.c1p3Valid=true;
      }
      else if (data == "Co2P1") {
        this.c2p1Valid=true;
      }
      else if (data == "Co2P2") {
        this.c2p2Valid=true;
      }
      else if (data == "Co2P3") {
        this.c2p3Valid=true;
      }
      else if (data == "Co3P1") {
        this.c3p1Valid=true;
      }
      else if (data == "Co3P2") {
        this.c3p2Valid=true;
      }
      else if (data == "Co3P3") {
        this.c3p3Valid=true;
      }
    }
    if (!isFileValid) {
      if (data == "Co1P1") {
        this.c1p1Valid=false;

        this.loadfilesFormGroup.patchValue({
          staLocCo1Po1: null
        });
      }
      else if (data == "Co1P2") {
        this.c1p2Valid=false;

        this.loadfilesFormGroup.patchValue({
          staLocCo1Po2: null
        });
      }
      else if (data == "Co1P3") {
        this.c1p3Valid=false;

        this.loadfilesFormGroup.patchValue({
          staLocCo1Po3: null
        });
      }
      else if (data == "Co2P1") {
        this.c2p1Valid=false;

        this.loadfilesFormGroup.patchValue({
          staLocCo2Po1: null
        });
      }
      else if (data == "Co2P2") {
        this.c2p2Valid=false;

        this.loadfilesFormGroup.patchValue({
          staLocCo2Po2: null
        });
      }
      else if (data == "Co2P3") {
        this.c2p3Valid=false;

        this.loadfilesFormGroup.patchValue({
          staLocCo2Po3: null
        });
      }
      else if (data == "Co3P1") {
        this.c3p1Valid=false;

        this.loadfilesFormGroup.patchValue({
          staLocCo3Po1: null
        });
      }
      else if (data == "Co3P2") {
        this.c3p2Valid=false;

        this.loadfilesFormGroup.patchValue({
          staLocCo3Po2: null
        });
      }
      else if (data == "Co3P3") {
        this.c3p3Valid=false;

        this.loadfilesFormGroup.patchValue({
          staLocCo3Po3: null
        });
      }
      
      const dialogData: tpsDialogData = {
        modalTitle: 'Invalid File Format',
        customTemplate: false,
        modalContent:'Select a proper STA (.sta) file ',
        primaryBtnText: 'Ok',
      }
      const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
    return isFileValid;
  }
  validateFilePrt(file: string,data: string)
  {
    

    const isFileValid = file.split('.')[1] === 'prt' ? true : false;
    if (isFileValid) {
      if (data == "prtCo1") {
        this.C1Valid=true;
 
      }
      else if (data == "prtCo2") {
        this.C2Valid=true;

      }
      else if (data == "prtCo3") {
        this.C3Valid=true;
      }
    }
    if (!isFileValid) {
      if (data == "prtCo1") {
        this.C1Valid=false;

        this.loadfilesFormGroup.patchValue({
          studyLocCo1: null
        });
      }
      else if (data == "prtCo2") {
        this.C2Valid=false;

        this.loadfilesFormGroup.patchValue({
          studyLocCo2: null
        });
      }
      else if (data == "prtCo3") {
        this.C3Valid=false;

        this.loadfilesFormGroup.patchValue({
          studyLocCo3: null
        });
      }
      const dialogData: tpsDialogData = {
        modalTitle: 'Invalid File Format',
        customTemplate: false,
        modalContent:'Select a proper PRT (.prt) file ',
        primaryBtnText: 'Ok',
      }
      const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
    return isFileValid;
  }

  

  
  onFileResetBtnClick(data: string) {
    if (data == "Co1P1") {
      this.c1p1Valid=false;

      this.staLocCo1P1 = null;
      this.count--;
      this.loadfilesFormGroupStat = false;

    }
    if (data == "Co1P2") {
      this.c1p2Valid=false;

      this.staLocCo1P2 = null;
      this.count--;
      this.loadfilesFormGroupStat = false;

    }
    if (data == "Co1P3") {
      this.c1p3Valid=false;

      this.staLocCo1P3 = null;
      this.count--;
      this.loadfilesFormGroupStat = false;

    }
    if (data == "Co2P1") {
      this.c2p1Valid=false;

      this.staLocCo2P1 = null;
      this.count--;
      this.loadfilesFormGroupStat = false;

    }
    if (data == "Co2P2") {
      this.c2p2Valid=false;

      this.staLocCo2P2 = null;
      this.count--;
      this.loadfilesFormGroupStat = false;

    }
    if (data == "Co2P3") {
      this.c2p3Valid=false;

      this.staLocCo2P3 = null;
      this.count--;
      this.loadfilesFormGroupStat = false;

    }
    if (data == "Co3P1") {
      this.c3p1Valid=false;

      this.staLocCo3P1 = null;
      this.count--;
      this.loadfilesFormGroupStat = false;

    }
    if (data == "Co3P2") {
      this.c3p2Valid=false;

      this.staLocCo3P2 = null;
      this.count--;
      this.loadfilesFormGroupStat = false;

    }
    if (data == "Co3P3") {
      this.c3p3Valid=false;

      this.staLocCo3P3 = null;
      this.count--;
      this.loadfilesFormGroupStat = false;

    }
    if (data == "prtCo1") {
this.C1Valid=false;
      this.studyLocCo1 = null;
      this.count--;
      this.loadfilesFormGroupStat = false;

    }
    if (data == "prtCo2") {
this.C2Valid=false;
      this.studyLocCo2 = null;
      this.count--;
      this.loadfilesFormGroupStat = false;

    }
    if (data == "prtCo3") {
this.C3Valid=false;
      this.studyLocCo3 = null;
      this.count--;
      this.loadfilesFormGroupStat = false;

    }

   
  }

  onClose(){
    this.dialogRef.close();

  }

  onInfoClick(event: Event){
    
  }
  onMouseEnter(){
    this.showImg=true;
  }
  onMouseLeave(){
    this.showImg=false;
  }
}
export interface loadFilesData {
  customTemplate: boolean;

  primaryBtnText?: string;
  secondaryBtnText?:string;
  editMode?:boolean;
  id:number;
}