import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { of, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { CompressorDetailUIModel, Portion } from '@core/models/CompressorDetailUIModel';
import { BOT_STATUS, JobRecordUIModel } from '@core/models/JobRecordUIModel';
import { TpsDialogComponent, tpsDialogData } from 'src/app/modules/shared/dialog/components/tps-dialog.component';

import { UtilityService } from '@core/services/utility.service';
import { CompressorData } from '../calc55-compressor/calc55-compressor.component';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Cal55LoadFilesComponent, loadFilesData } from '../cal55-load-files/cal55-load-files.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cal55LoginComponent } from '../cal55-login/cal55-login.component';
import { browser } from 'protractor';
import { Console } from 'console';
import { loadFilesModelData } from '@core/models/loadFilesModel';
import { StatBot } from '@core/models/statBot';
//import { DatePipe } from '@angular/common';

@Component({
  selector: 'tps-calc55-home',
  templateUrl: './calc55-home.component.html',
  styleUrls: ['./calc55-home.component.scss']
})

export class Calc55HomeComponent implements OnInit, OnDestroy {

  
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  @ViewChild('fileUpload')
  fileUpload: ElementRef;

  editMode = false;
  loadmode=false;
  projectFormDirty = false;
  selected = true;
  showCompressorDetails = false;
  compDetailsValid = true;
  fileName: string
  inputFileLocation: string;
  selPosition = "Int";
  selOutlet = "Smooth";
  selStartAngle = "Default";
  setLoadStatus = true;
  LoadFilesUploadVal=false;
  botStat: StatBot;
  currentJob: JobRecordUIModel;
  filepath:loadFilesModelData[]=[];
  projectFormGroup: FormGroup;
  compressorFormGroup: FormGroup;
  loadFileVals = new Map<string, number>();
  displayedColumns = ['id', 'compType', 'name', 'position', 'outlet', 'collector', 'startAngle'];
  compressorList: CompressorDetailUIModel[] = [];
  dataSource: MatTableDataSource<CompressorDetailUIModel>;
  selection = new SelectionModel<CompressorDetailUIModel>(true, []);
  private dataSubList: Subscription[] = [];
  userName: string;
  Message: string;
  dataValidStatus: boolean;
  botClassVal: string;
  runButtonStatus: boolean;
  projectFormGroupValid: boolean;
dataIdFOrEdit:number;
runButtonValid:boolean
  dataUserStatus: boolean;
  style: string;
  url: string | ArrayBuffer;
  filepathname: string[];
  loadFileVals1 = new Array<{compressor: any, portion: any}>();

  datapass = new Array<{ jobRecId: any,password: string, ssoid: string,status:string,toolId:any}>();
  myDate: string;

  recidforRun:number;
  fileimg: boolean;
  errorMessage: any;

  constructor(private router: Router, private route: ActivatedRoute, public dialog: MatDialog,
    private fb: FormBuilder, private utilityService: UtilityService, private _snackBar: MatSnackBar) { }


  onClick(event) {
    this.fileimg=true;

    if (this.fileUpload)
      this.fileUpload.nativeElement.click()
  }

  onInput(event) {
  }
  onAdfInput()
  {
    this.inputFileLocation== this.projectFormGroup.controls.location.value.replaceAll('"','');

  }
  onFileResetBtnClick() {
    this.fileName = null;
    this.inputFileLocation = null;
    this.showCompressorDetails = false;
    this.dataSource = null;
    this.fileUpload.nativeElement.value = "";

    this.utilityService.setLoadFilesButton(false);
    this.utilityService.setRunButton(false);
    this.compDetailsValid=false;
  }


  onFileSelected(event) {
    this.fileimg=false;

    this.projectFormGroup.controls.location.reset();

    const file: File = event.target.files[0];
    var reader1 = new FileReader();
    if (file && this.validateFile(file)) {
      this.fileName = file.name;
      this.inputFileLocation = event.path[0].value;
      
      reader1.onload = (event: ProgressEvent) => {
        this.url = (<FileReader>event.target).result;
      }

      this.projectFormGroup.patchValue({
        location: this.fileName
      });
      let reader = new FileReader();

      reader.readAsText(file);
      reader.onloadend = (event: ProgressEvent) => {
        const data: string = (reader.result as string);
        this.construtData(data);

      }
      this.projectFormGroup.controls.location.setErrors(null);
    } 
    else 
    {
     alert("Invalid File!!!!!!!!")
    }
  }


  // Construct Compressor Data
  //Edited by Ashim on 01-04-2022
  construtData(data: string) {
    let compressorNumber
    let compressorArr: AdfFileDetail[] = [];
    let portionList: PortionDetail[] = [];
    const dataArr1 = data.split(';\n').forEach(line => {
      if (line.includes("NumberCasings")) {
        compressorNumber = line.split(':')[1]
      }
      
    });
    if(!compressorNumber)
      {
        this.showCompressorDetails=false;
  
        const dialogData: tpsDialogData = {
          modalTitle: 'Error in ADF',
          customTemplate: false,
          modalContent: 'Compressors missing in ADF FIle, Please select Correct ADF File',
          primaryBtnText: 'Ok',
        }
        const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData, disableClose: true  });
        
        dialogRef.afterClosed().subscribe(result => {
        });
        return false;
        
      }
    for (let i = 1; i <= compressorNumber; i++) {
      var varCompName = 'Co' + i + '_CorpsDesignation';
      //var filepathname= 'pathfile';
      const dataArr = data.split(';\n').forEach(line => {

        if (line.includes(varCompName)) {
          compressorArr.push({
            id: compressorArr.length == 0 ? 1 : compressorArr[compressorArr.length - 1].id + 1,
            name: line.split(':')[1]

          });
        }
        
      });
    }

    for (let i = 1; i <= compressorNumber; i++) {

      const dataArr2 = data.split(';\n').forEach(line => {
        var varPortNum = 'Co' + i + '_NumberPortions';

        if (line.includes(varPortNum)) {
          const portion = line.split(':');
          portionList.push({
            id: parseInt(portion[0].split('_')[0].split('Co')[1]),
            count: parseInt(portion[1])
          })
        }

        //(+line.split(':')[1])
      });
    }
    
    portionList.forEach((portion) => {
      const compressorIdx = compressorArr.findIndex(com => com.id === portion.id);
      if (compressorIdx !== -1) {
        compressorArr[compressorIdx].portionCount = portion.count;
      }
    });

    this.compressorList = [];
    compressorArr.forEach(comp => {
      this.compressorList.push(
        {
          compId: comp.id,
          checkedStatus: false,
          portionEnabled: comp.portionCount > 0 ? true : false,
          portion: this.constructPortionList(comp.portionCount),
          compType: `Compressor ${comp.id}`,
          name: comp.name,
          productStructre:false,
          position: null,
          outlet: null,
          collector: false,
          startAngle: null,
          value: null,
          enabled:false,
          thetaEnabled:false,
        }
      );
    });
    this.showCompressorDetails = true;

    if (compressorArr.length != compressorNumber) {
      if(compressorArr.length != compressorNumber && portionList.length != compressorNumber)
      {
        this.showCompressorDetails=false;
  
        const dialogData: tpsDialogData = {
          modalTitle: 'Error in ADF',
          customTemplate: false,
          modalContent: 'Compressors details and Portion Details missing in ADF FIle, Please select Correct ADF File',
          primaryBtnText: 'Ok',
        }
        const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData, disableClose: true  });
        dialogRef.afterClosed().subscribe(result => {
        });
        return false;

      }
      else{
      this.showCompressorDetails=false;

      const dialogData: tpsDialogData = {
        modalTitle: 'Error in ADF',
        customTemplate: false,
        modalContent: 'Compressors details missing in ADF FIle, Please select Correct ADF File',
        primaryBtnText: 'Ok',
      }
      const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData , disableClose: true });
      dialogRef.afterClosed().subscribe(result => {
      });
      return false;
    }
    }
    if (portionList.length != compressorNumber) {
      if(compressorArr.length != compressorNumber && portionList.length != compressorNumber)
      {
        this.showCompressorDetails=false;
  
        const dialogData: tpsDialogData = {
          modalTitle: 'Error in ADF',
          customTemplate: false,
          modalContent: 'Compressors details and Portion Details missing in ADF FIle, Please select Correct ADF File',
          primaryBtnText: 'Ok',
        }
        const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData , disableClose: true });
        dialogRef.afterClosed().subscribe(result => {
        });
        return false;
      }
      else{  
      this.showCompressorDetails=false;
      const dialogData: tpsDialogData = {
        modalTitle: 'Error in ADF',
        customTemplate: false,
        modalContent: 'Portions missing in ADF FIle, Please select Correct ADF File',
        primaryBtnText: 'Ok',
      }
      const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData, disableClose: true  });
      dialogRef.afterClosed().subscribe(result => {
      });
      return false;
    }
    }
  }

  // construct portion Form Aray
  constructPortionFormGroup(portionCount: number) {
    let portionData: FormGroup[] = [];
    for (let i = 1; i <= portionCount; i++) {
      portionData?.push(this.fb.group({
        id: i,
        name: `Portion-${i}`,
        checked: false
      }));
    }
    return portionData;
  }

  // construct portion List
  constructPortionList(portionCount: number) {
    let portionData: Portion[] = []
    for (let i = 1; i <= portionCount; i++) {
      portionData.push({
        portionId: i,
        name: `Portion-${i}`,
        filePath: "",
        checked: false
      });
    }
    return portionData;
  }

  // Validate file extension
  validateFile(file: File) {
    const isFileValid = file.name.split('.')[1] === 'adf' ? true : false;
    if (!isFileValid) {
      this.projectFormGroup.patchValue({
        location: null
        
      });
      const dialogData: tpsDialogData = {
        modalTitle: 'Invalid File Format',
        customTemplate: false,
        modalContent:'Select a proper .adf file extention',
        primaryBtnText: 'Ok',
      }
      const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData , disableClose: true });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
    return isFileValid;
  }

  /** Builds and returns a new job record. */
  createNewJob(): JobRecordUIModel {
    const randomId = Math.floor(Math.random() * 10) + 1;
    return {
      jobid: randomId,
      recId: randomId,
      jobName: `Athena_Calc55_${randomId}`,
      owner: `test_user_${randomId}`,
      location: '',
      creationdate: new Date().getTime(),
      botStatus:'',
      userStatus: true,
      toolId:0,
      saveMethod:0

    };
  }

  createFormGroup() {
    this.projectFormGroup = this.fb.group({
      id: -1,
      name: new FormControl('', Validators.required),

      location: new FormControl('', Validators.required),
      
      
      compressorDetails: new FormArray([])
    });
  }

  onSaveBtnClick(event) {
    console.log("compressor values",this.compressorList)
    this.utilityService.getUsername$.subscribe(data => {
      this.userName = data;
      
    });
    
    if (!this.editMode) {

      this.utilityService.setRevisionButton(true);
    }
    // else {
    //   this.utilityService.setRevisionButton(false);
    // }

    const dialogData: tpsDialogData = {

      modalTitle: `Save Project`,
      customTemplate: true,
      modalContent: this.projectFormGroup.controls.name.value,
      primaryBtnText: 'Save',
      seondaryBtnText: 'New Revision',

      tertiaryBtnText: 'Cancel'
    }

    const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData, disableClose: true  });
    dialogRef.afterClosed().subscribe(data => {
      if (!this.editMode) {
        this.currentJob = this.projectFormGroup.value;
        

      }
      
      const now = new Date()
    

      this.currentJob.toolId=2;
      this.currentJob.creationdate=now.getTime();
      this.currentJob.botStatus="New"
      this.currentJob.owner=this.userName
      this.currentJob.jobName = this.projectFormGroup.controls.name.value;
      //this.currentJob.botStatus
      this.currentJob.location = this.projectFormGroup.controls.location.value.replaceAll('"','');
    
      this.currentJob.compressorDetails = this.compressorList;
      // this.currentJob.compressorDetails.forEach(item=>{
      //   item.portion.forEach(i=>{
      //     i.filePath=this.currentJob.filePath

      //   })
      //})

      if(this.editMode)
      {
        this.currentJob.filePath=this.filepath;
      }else{
      var storefilepath=(JSON.parse(sessionStorage.getItem("load_filepath_save")));
      this.currentJob.filePath=storefilepath
      }

      if(!this.currentJob.jobid)
      {
        this.currentJob.saveMethod=1;
      }
      else{
      this.currentJob.saveMethod=3;
      }
      ////console.log("save data",this.currentJob.compressorDetails, "filepath is", this.currentJob.filePath)
      //console.log("on save details are",this.currentJob)


      if (data=="revision") {
        console.log(this.currentJob)

        this.loadmode=true;
                this.currentJob.saveMethod=2;

        const subscription = this.utilityService.saveCalcData(this.currentJob).subscribe(data => {
          if (data) {
            var string=data.message+'';
            var split=string.split(' ');
            this.recidforRun=+split[0];
        //console.log("this is ",data)

        //this.utilityService.updateVersionDetails(data);
        this.utilityService.version$.next({
          enabled: true,
          value: this.recidforRun
        });
        this.utilityService.botstat$.next({
          enabled1: true,
          value1: this.currentJob.botStatus
          
        });

        this.recidforRun=data;
        this.Message = `${this.projectFormGroup.controls.name.value} New Project Revision Saved Succesfully`;
        this.style="custom-style-success"
        this.openSnackBar1();
        this.runButtonStatus=true;
        this.runButtonValid=true;
        this.hideloader();
        this.loadmode=false;
          }
        },
        (error) => {//Error callback
          this.hideloader();
         console.error('error caught in component')
         this.errorMessage = error;

         alert(this.errorMessage.error.message+",Please try Saving data again")
    
       })
      }
      
      else if(data==this.projectFormGroup.controls.name.value){
        this.loadmode=true;


        if(this.currentJob.saveMethod==1)
        {
          console.log(this.currentJob)

          const subscription = this.utilityService.saveCalcData(this.currentJob).subscribe(data => {
            if (data) {
  
              var string=data.message+'';
              var split=string.split(' ');
              this.recidforRun=+split[0];
          //console.log(this.recidforRun) 
  
          //this.utilityService.updateVersionDetails(this.recidforRun);
          this.utilityService.version$.next({
            enabled: true,
            value: this.recidforRun
          });
          this.utilityService.botstat$.next({
            enabled1: true,
            value1: this.currentJob.botStatus
            
          });
          
          this.Message =`${this.projectFormGroup.controls.name.value} New Project Saved Succesfully`;
          this.style="custom-style-success"
          this.openSnackBar1();
          this.runButtonStatus=true;
          this.runButtonValid=true;
          this.hideloader();
          this.loadmode=false
  
            }
          },
          (error) => {//Error callback
            this.hideloader();
           console.error('error caught in component')
           this.errorMessage = error;
  
           alert(this.errorMessage.error.message+",Please try Saving data again")
      
         }) 
        }
        if(this.currentJob.saveMethod==3)
        {
          console.log(this.currentJob)

          const subscription = this.utilityService.updateCalcData(this.currentJob).subscribe(data => {
            if (data) {
  
              var string=data.message+'';
              var split=string.split(' ');
              this.recidforRun=+split[0];
          //console.log(this.recidforRun) 
  
          //this.utilityService.updateVersionDetails(this.recidforRun);
          this.utilityService.version$.next({
            enabled: true,
            value: this.recidforRun
          });
          this.utilityService.botstat$.next({
            enabled1: true,
            value1: this.currentJob.botStatus
            
          });
          
          this.Message = "Project Saved Succesfully";
          this.style="custom-style-success"
          this.openSnackBar1();
          this.runButtonStatus=true;
          this.runButtonValid=true;
          this.hideloader();
          this.loadmode=false
  
            }
          },
          (error) => {//Error callback
            this.hideloader();
           console.error('error caught in component')
           this.errorMessage = error;
  
           alert(this.errorMessage.error.message+",Please try Saving data again")
      
         }) 
        }
         
      }
    });

  }
  openSnackBar1() {
    this._snackBar.open(this.Message,'OK',{
      verticalPosition: 'bottom',
      duration: 2500,
      panelClass:this.style
      
    });
    
  }


  onNewBtnClick() {
    sessionStorage.clear();
    this.projectFormGroupValid=false;
    this.runButtonValid=false;
    this.runButtonStatus=false;
    this.router.navigateByUrl('calc55/new');
    this.resetProjectForm();
    this.compressorList = null;
    this.showCompressorDetails = false;
    this.utilityService.version$.next({
      enabled: false,
      value: null
    });
    this.utilityService.botstat$.next({
      enabled1: false,
      value1: null
    });



    this.fileName = null;
    this.inputFileLocation = null;
    this.showCompressorDetails = false;
    this.dataSource = null;
    this.fileUpload.nativeElement.value = "";

    this.utilityService.setLoadFilesButton(false);
    this.utilityService.setRunButton(false);
    this.compDetailsValid=false;
  }

  resetProjectForm() {
    this.editMode = false;
    this.projectFormGroup.reset();
  }

  hideloader() {
  
    // Setting display of spinner
    // element to none
    document.getElementById('loading')
        .style.display = 'none';
}

  fillDataByJobId(jobId) {
    this.loadmode=true;

    this.dataValidStatus = false;
    this.projectFormGroupValid=false;
    
    const jobEdit = 'http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/calc/get-by-jobId/' + jobId + ',2';
    //console.log("job id", jobId, jobEdit)
    const subscription1 = this.utilityService.getJobListEdit(jobEdit).subscribe(data => {
      //console.log("data in get id", data)
      // })
      //       const subscription = this.utilityService.getJobList().subscribe(data => {

      if (data) {
        this.hideloader();
      this.loadmode=false;
        //this.currentJob = data.find(j => j.jobid === jobId);
        this.currentJob=data;
        //console.log("data is",data,"current job", this.currentJob)


        if (this.currentJob.owner.toLowerCase() == this.userName.toLowerCase()) {
          this.dataValidStatus = false;
        this.projectFormGroupValid=true;
        this.runButtonStatus=true;
        this.runButtonValid=true;
          //console.log('useris', this.dataValidStatus)
          this.utilityService.setSaveButton(true);
        this.utilityService.setUserStatus(true);

        }
        else {
          //console.log('data is ', this.currentJob)
          this.dataValidStatus = true
        this.projectFormGroupValid=true;
          //console.log('useris', this.dataValidStatus)
          this.utilityService.setUserStatus(false);
       this.utilityService.setSaveButton(false);
          this.projectFormGroup.disable();
         
          
        }
        this.projectFormGroup.patchValue({

          id: this.currentJob.jobid,
          name: this.currentJob.jobName,
          location: this.currentJob.location,
        });
        this.recidforRun=this.currentJob.recId;
        this.compressorList = this.currentJob.compressorDetails;
        this.filepath=this.currentJob.filePath
        this.showCompressorDetails = true;
        // Update current job
        this.utilityService.version$.next({
          enabled: true,
          value: this.currentJob.recId
        });
        this.utilityService.botstat$.next({
          enabled1: true,
          value1: this.currentJob.botStatus
    
          
        });
    
        
      }
      console.log("in home",this.currentJob,"&",this.compressorList,"&",this.filepath);
    },
    (error) => {//Error callback
      this.hideloader();

     console.error('error caught in component')
     this.errorMessage = error;
  
     alert(this.errorMessage.error.message+",Error in loading data, Please try again")
  
   });
   
    
  }

  compDetailChange(event: CompressorData) {

    this.compDetailsValid = event.valid;
    if (event.valid) {
      this.compressorList = event.data;
    }
  }

  ngOnInit(): void {

    
    sessionStorage.clear();
    
    this.projectFormGroupValid=false;
    this.runButtonValid=false;
    this.utilityService.setUserStatus(true);
    this.dataValidStatus=true;
    this.utilityService.runButtonStatus$.subscribe(data => {
      this.runButtonStatus=data;
    });
    this.runButtonStatus=false;
    this.utilityService.getUsername$.subscribe(data => {
      this.userName = data;
    });

    let randomId = Math.floor(Math.random() * 100) + 1;
    this.createFormGroup();


    this.route.paramMap.subscribe((params) => {
      this.dataIdFOrEdit=parseInt(params.get('id'));
      //console.log(params)
      if (params.get('id')) {
        this.editMode = true;
        //this.jbId=jobId;

        const jobId = parseInt(params.get('id'));
        const recId = params.get('id');
//console.log(this.dataIdFOrEdit)
        this.fillDataByJobId(jobId);
        
      } else { // New Job 
        
        this.createFormGroup();
        this.selPosition = null;
        this.selOutlet = null;
        this.selStartAngle = null;

      }

    });

    this.utilityService.loadFilesButton$.subscribe(data => {
      this.setLoadStatus = data
      this.projectFormGroupValid=false;
    })
    this.utilityService.loadFileStatus$.subscribe(data=>{
      this.LoadFilesUploadVal = data
    })
    this.utilityService.nonCurrentUser$.subscribe(userData => {
      this.dataUserStatus = userData;});

  }

  ngOnDestroy(): void {

    this.utilityService.version$.next({
      enabled: false,
      value: null
    })
    this.utilityService.botstat$.next({
      enabled1: false,
      value1: null
    })


    if (this.dataSubList.length > 0) {
      this.dataSubList.forEach(subscription => {
        if (subscription) {
          subscription.unsubscribe();
          subscription = null;
        }
      });
    }
    this.dataSubList = [];
  }

  onLoadFiles() {

    if (!this.editMode)
    {
      const loadData: loadFilesData = {
        customTemplate: false,
        primaryBtnText: 'submit',
        id: 0
      }

    const dialogRef = this.dialog.open(Cal55LoadFilesComponent, { data: loadData, disableClose: true });
    dialogRef.afterClosed().subscribe(data => { 

      var storedFilepath = JSON.parse(sessionStorage.getItem("load_filepath")); 

    });
    }
    else{
      
      this.utilityService.getDetails$.subscribe(data => {
     
        this.loadFileVals1=data
     
      })
   
      
      // const subscription = this.utilityService.getJobList().subscribe(data => {
       if (this.loadFileVals1.length == 0) {
      //     if (data) {
      //       this.currentJob = data.find(j => j.jobid === this.dataIdFOrEdit);

            this.currentJob.compressorDetails.forEach(element => {
              if (element.checkedStatus) {
                element.portion.forEach(portion => {
                  if (portion.checked) {
                    this.loadFileVals1.push({ compressor: element.compType, portion: portion.name })
                  }
                })
              }

            })

          }
          this.utilityService.getLoadFilesData(this.loadFileVals1);
        //}


        const loadData: loadFilesData = {
          customTemplate: false,
          primaryBtnText: 'submit',
          editMode: this.editMode,
          id: this.dataIdFOrEdit,
        }

        const dialogRef = this.dialog.open(Cal55LoadFilesComponent, { data: loadData, disableClose: true });
        dialogRef.afterClosed().subscribe(data => {


          //console.log(data);
        });
      //});

    
    }

  }

  openSnackBar() {
    this._snackBar.open(this.Message, 'ok', {
      verticalPosition: 'bottom',
      duration: 2500,
    });
  }

  

  onRunBtnClick(event)
  {
    
    this.fakeData().subscribe((res) => {
      //console.log(res.data)
      this.dyanmicDownloadByHtmlTag({
        fileName: 'TPS-CALCBOT.bat',
        text: res.data,
         
      });
      
    });
    const loadData: loadFilesData = {
      customTemplate: false,
      primaryBtnText: 'login',
      editMode: this.editMode,
      id: this.dataIdFOrEdit,
    }
    
    // const dialogRef = this.dialog.open(Cal55LoginComponent, {data: loadData });
    // dialogRef.afterClosed().subscribe(data => { 
    //   if(data=="saved")
    //   {
    //   var storedpath=JSON.parse(sessionStorage.getItem("logindata")); 

      this.datapass.push({ jobRecId: this.recidforRun,password: this.userName, ssoid: this.userName,status:"Bot-Triggered",toolId:2 })
      this.botStat=this.datapass[0]

      console.log("run in",this.botStat)
      const subscription = this.utilityService.botStat(this.botStat).subscribe(data1 => {
        if(data1){
          console.log(data1)
          this.datapass.pop(); 

        }

      });
    // }
    // });
   
  }

  fakeData() {
    return of({
    data:'"C:/Program Files (x86)/UiPath/Studio/UiRobot.exe" execute -p CALC55_EX5_BOT'
    });
  }
  
  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.bat') > -1 ? 'text/bat' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
   // var open = new MouseEvent("click") 
    element.dispatchEvent(event);
  }
  //  open=browser.downloads.open(1)
}



export interface AdfFileDetail {
  id: number,
  name: string;
  portionCount?: number;
}

export interface PortionDetail {
  id: number,
  count: number;
}


function data(data: any) {
  throw new Error('Function not implemented.');
}

