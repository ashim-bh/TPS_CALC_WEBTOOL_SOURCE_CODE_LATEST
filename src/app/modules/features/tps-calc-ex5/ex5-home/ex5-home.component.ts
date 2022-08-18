import { Component, OnInit,ViewEncapsulation} from '@angular/core';
import { ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { of, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { Ex5JobRecordUIModel } from '@core/models/Ex5JobRecordUIModel';
import { TpsDialogComponent, tpsDialogData } from 'src/app/modules/shared/dialog/components/tps-dialog.component';
import { UtilityService } from '@core/services/utility.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import {Ex5LoadFilesComponent , loadFilesData } from '../ex5-load-files/ex5-load-files.component';
import { CompressorData } from '../ex5-compressor/ex5-compressor.component';
import { Ex5CompressorDetailUIModel } from '@core/models/Ex5CompressorDetailUIModel';
import { Ex5LoginComponent } from '../ex5-login/ex5-login.component';
import { DecimalPipe } from '@angular/common';
import { StatBot } from '@core/models/statBot';
import { loadFilesModelDataEx5 } from '@core/models/loadFilesModelEx5';

@Component({
  selector: 'tps-ex5-home',
  templateUrl: './ex5-home.component.html',
  styleUrls: ['./ex5-home.component.scss'],
  encapsulation:ViewEncapsulation.None,
})
export class Ex5HomeComponent implements OnInit {
  projectFormGroup: FormGroup;
  Message: string;
  fileName: string;
  dataSource: any;
  @ViewChild('fileUpload')
  fileUpload: ElementRef;

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  loadmode=false;
  editMode = false;
  projectFormDirty = false;
  selected = true;
  showCompressorDetails = false;
  compDetailsValid = true;
  seal:"oil seals";
  hl1:null;
  hl2:null;
  Jbavg:null;
  durationInSeconds=2;
  runButtonStatus: boolean;
  inputFileLocation: string;
  setLoadStatus = true;
  currentJob: Ex5JobRecordUIModel;
  compressorFormGroup: FormGroup;
  LoadFilesUploadVal=false;
  displayedColumns = ['id', 'compType', 'name', 'sealtype', 'L1' ,' L2', 'JBavg'];
  compressorList: Ex5CompressorDetailUIModel[] = [];
  selection = new SelectionModel<Ex5CompressorDetailUIModel>(true, []);
  private dataSubList: Subscription[] = [];
  userName: string;
  dataValidStatus= false;
  loadfilesFormGroup: any;
  dataUserStatus: boolean;
  projectFormGroupValid= false;
  dataIdFOrEdit:number;
  loadFileValsEx5 = new Map<string, number>();
  runButtonValid:boolean
  style: string;
  msg:string;
  msg1:string;
  msg2:string;
  tavg:string;
  tmin:string;
  tmax:string;
  loadFileValsEx51 = new Array<{compressor: any}>();
  recidforRun: number;
  botStat: StatBot;
  jbId: number;
  datapass = new Array<{ jobRecId: any,password: string, ssoid: string,status:string,toolId:any}>();
  fileimg: boolean;
  filepath: loadFilesModelDataEx5[]=[];
  tempmessage: string;
  tempStat: boolean;
  tempStatmin: boolean;
  tempmessagemin: string;
  tempStatmax: boolean;
  tempmessagemax: string;
  tempStattmin: boolean;
  tempStattmax: boolean;
  tempStattavg: boolean;
  tempmessagetmin: string;
  tempmessagetmax: string;
  tempmessagetavg: string;
  errorMessage: any;

  constructor( public dialog: MatDialog,private fb: FormBuilder,private router:Router,
    private _snackBar: MatSnackBar,private utilityService: UtilityService,  private route: ActivatedRoute){}
 
  onClick(event: any) {
    this.fileimg=true;

    //console.log(event)
    if (this.fileUpload)
      this.fileUpload.nativeElement.click()
  }

  onInput(event: any) {
    //console.log('this event', event)
  }
  onFileResetBtnClick() {
    this.fileName = null;
    this.inputFileLocation = null;
    this.showCompressorDetails = false;
    this.dataSource = null;
    this.fileUpload.nativeElement.value = "";
    //updated on 18-05-2022
    this.utilityService.setLoadFilesButton(false);
    this.utilityService.setRunButton(false);
    this.compDetailsValid=false;
    this.LoadFilesUploadVal=false;
    this.dataValidStatus=false;
    //this.utilityService.setSaveButton(false);
    //this.dataValidStatus=false;
    //this.dataUserStatus=false;
      //this.utilityService.setUserStatus(false);

    //console.log(this.fileUpload.nativeElement)
  }

  onFileSelected(event:any) {
    this.fileimg=false;

    //console.log("location first", this.projectFormGroup.controls.location)

    this.projectFormGroup.controls.location.reset();

    const file: File = event.target.files[0];
    //console.log()
    if (file && this.validateFile(file)) {
      //console.log((event));
      this.fileName = file.name;
      this.inputFileLocation = event.path[0].value;
      //console.log(event.path[0].value);
      this.projectFormGroup.patchValue({
        //updated on 23/06/2022
        location: event.path[0].value
        
      });
      let reader = new FileReader();

      reader.readAsText(file);
      reader.onloadend = (event: ProgressEvent) => {
        const data: string = (reader.result as string);
        this.construtData(data);

      }
      //console.log("location", this.projectFormGroup.controls.location, this.projectFormGroup)
      this.projectFormGroup.controls.location.setErrors(null);
    } else {
      //console.log('invalid file....');
    }
    
   //updated on 23/06/2022
     this.showCompressorDetails = false;
    this.dataSource = null;
    this.fileUpload.nativeElement.value = "";
    // this.LoadFilesUploadVal=false;
     this.utilityService.setLoadFilesButton(false);
     this.compDetailsValid=false;
    this.LoadFilesUploadVal=false;
    this.dataValidStatus=false;
    this.utilityService.setRunButton(false);

  }



  construtData(data: string) {
    let compressorNumber;
    let compressorArr: AdfFileDetail[] = [];
    
    const dataArr1 = data.split(';\n').forEach(line => {
      if (line.includes("NumberCasings")) {
        compressorNumber = line.split(':')[1]
        //console.log(compressorNumber);
      }
    });
    for (let i = 1; i <= compressorNumber; i++) {
      var varCompName = 'Co' + i + '_CorpsDesignation';
      const dataArr = data.split(';\n').forEach(line => {

        if (line.includes(varCompName)) {
          compressorArr.push({
            id: compressorArr.length == 0 ? 1 : compressorArr[compressorArr.length - 1].id + 1,
            name: line.split(':')[1]

          });
        }
      });
    }
    //console.log(compressorArr,  compressorNumber)
   

    this.compressorList = [];
    compressorArr.forEach(comp => {
      this.compressorList.push( {
        compId: comp.id,
        checkedStatus: false,     
        compType: `Compressor ${comp.id}`,
        name: comp.name,
        sealType: null,
        sealTemperature: null,
        heightOfAwayfromkey: null,
        heightOfsupportnearkey: null,
        jbavg: null,
        enabled:false
      }
    );
  });
  this.showCompressorDetails = true;

  if (compressorArr.length != compressorNumber) {
    //console.log('Compressors details missing in ADF FIle')
    this.showCompressorDetails=false;

    const dialogData: tpsDialogData = {
      modalTitle: 'Error in ADF',
      customTemplate: false,
      modalContent: 'Compressors details missing in ADF FIle, Please select Correct ADF File',
      primaryBtnText: 'OK',
    }
    const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
    });
  }
  }
 

  /** Builds and returns a new job record. */
  createNewJob(): Ex5JobRecordUIModel {
  const randomId = Math.floor(Math.random() * 10) + 1;
  return {
    jobid: randomId,
    recId: randomId,
    jobName: `Athena_Calc55_${randomId}`,
    owner: `test_user_${randomId}`,
    location: '',
    tavg:randomId,
    tmax:randomId,
    tmin:randomId,
    creationdate: new Date().getTime(),
    botStatus: '',
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
      tavg:new FormControl('', Validators.required),
      tmin:new FormControl('', Validators.required),
      tmax:new FormControl('', Validators.required),
      compressorDetails: new FormArray([])
    });
  }

  onLoadFiles(){

    if (!this.editMode)
    {
    const loadData: loadFilesData = {
      customTemplate: false,
      primaryBtnText: 'submit',
      jobid: 0
    }

    const dialogRef = this.dialog.open(Ex5LoadFilesComponent, { data: loadData });
    dialogRef.afterClosed().subscribe(data => { });
  }
  else{
    this.utilityService.getDetailsEx5$.subscribe(dataitems => {
      this.loadFileValsEx51=dataitems
     
 })
 //const jobEdit='http://bhijxfh2j3:8099/api/v1/Ex/get-by-jobId/'+this.jbId+',1';

 //const subscription1 = this.utilityService.getJobListEditEX(jobEdit).subscribe(data => {

    //const subscription = this.utilityService.getJobListEx5().subscribe(data => {
     if(this.loadFileValsEx51.length==0)
     {
      // if (data) {    
      //   this.currentJob = data;
        this.currentJob.exCompressorDetails.forEach(element => {
          //console.log("the element is",element)
          if (element.checkedStatus==true)
          {
           
            this.loadFileValsEx51.push({compressor:element.compType});
            //console.log(this.loadFileValsEx5);
          }

        })

     // }
      //console.log("data in edit loadfiles",this.loadFileValsEx51)
      this.utilityService.getLoadFilesEx5Data(this.loadFileValsEx51);
    }
    const loadData: loadFilesData = {
      customTemplate: false,
      primaryBtnText: 'submit',
      editMode: this.editMode,
      jobid:this.dataIdFOrEdit,
    }

    const dialogRef = this.dialog.open(Ex5LoadFilesComponent, { data: loadData, disableClose: true });
    dialogRef.afterClosed().subscribe(data => { });
     // });
    }

  }
  // get f(){
  //   return this.projectFormGroup.controls;
  // }


  openSnackBar() {
    this._snackBar.open(this.Message, 'OK', {
      verticalPosition: 'bottom',
      duration: 2500,
      panelClass: this.style,
      
    });
  }
  hideloader() {
  
    // Setting display of spinner
    // element to none
    document.getElementById('loading')
        .style.display = 'none';
}

  onSaveBtnClick(event) {

    this.utilityService.getUsername$.subscribe(data => {
      this.userName = data;
      
    });
    if (!this.editMode) {
      this.utilityService.setRevisionButton(true);
    }
    else {
      this.utilityService.setRevisionButton(false);
    }
    //console.log("user name  is",this.userName);

    const dialogData: tpsDialogData = {

      modalTitle: `Save Project`,
      customTemplate: true,
      modalContent: this.projectFormGroup.controls.name.value,
      primaryBtnText: 'Save',
      seondaryBtnText: 'New Revision',

      tertiaryBtnText: 'Cancel'
    }

    const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData,disableClose: true });
    dialogRef.afterClosed().subscribe(data => {
      if (!this.editMode) {
        this.currentJob = this.projectFormGroup.value;

      }
      const now = new Date();

      this.currentJob.toolId=1;
      this.currentJob.creationdate=now.getTime();
      this.currentJob.botStatus="New"
      this.currentJob.owner=this.userName
      this.currentJob.jobName = this.projectFormGroup.controls.name.value;
      this.currentJob.location = this.projectFormGroup.controls.location.value.replaceAll('"','');
      this.currentJob.exCompressorDetails = this.compressorList;
      if(this.editMode)
      {
        this.currentJob.exFilePathData=this.filepath;
      }else{
      var storefilepath=(JSON.parse(sessionStorage.getItem("load_filepath_save")));
      this.currentJob.exFilePathData=storefilepath
      }
      
      if(!this.currentJob.jobid)
      {
        this.currentJob.saveMethod=1;

      }else{
      this.currentJob.saveMethod=3;
      }

      if (data=="revision") {
        this.loadmode=true;

        this.currentJob.saveMethod=2;
        const subscription = this.utilityService.saveExData(this.currentJob).subscribe(data => {
          if (data) {
        //console.log("this is ",data)
        
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
        this.Message =`New project revision saved succesfully!`;
        this.style="custom-style-success";
        this.openSnackBar();
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
          const subscription = this.utilityService.saveExData(this.currentJob).subscribe(data => {
            if (data) {
          //console.log(data)
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
  
          this.Message = `${this.projectFormGroup.controls.name.value} project saved succesfully`;
          this.style="custom-style-success";
          this.openSnackBar();
          this.runButtonStatus=true;
          this.runButtonValid=true;
          this.loadmode=false
          this.hideloader();
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
          const subscription = this.utilityService.updateExData(this.currentJob).subscribe(data => {
            if (data) {
          //console.log(data)
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
  
          this.Message = `${this.projectFormGroup.controls.name.value} project saved succesfully`;
          this.style="custom-style-success";
          this.openSnackBar();
          this.runButtonStatus=true;
          this.runButtonValid=true;
          this.loadmode=false
          this.hideloader();
  
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
        modalContent:'Select a proper Adf file',
        primaryBtnText: 'Ok',
      }
      const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        //console.log(result);
      });
    }
    return isFileValid;
  }


resetProjectForm() {
  this.editMode = false;
  this.projectFormGroup.reset();
}


fillDataByJobId(jobId) {

  this.loadmode=true;
  this.dataValidStatus = false;
  this.projectFormGroupValid=false;
 // this.runButtonValid=true;


  const jobEdit='http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/Ex/get-by-jobId/'+jobId+',1';

  const subscription1 = this.utilityService.getJobListEditEX(jobEdit).subscribe(data => {
  //   if(data1)
  //   this.currentJob = data1;
  //   //console.log("this is the ",[data1],this.currentJob);

  // })
  // const subscription = this.utilityService.getJobListEx5().subscribe(data => {
 // //console.log(data)
  if (data) {
      this.hideloader();
      this.loadmode=false;

      this.currentJob = data;
      //console.log(this.currentJob)
     // this.currentJob=;
      if (this.currentJob.owner.toLowerCase() == this.userName.toLowerCase()) {
        
        this.dataValidStatus = false;
        this.projectFormGroupValid=true;
        this.runButtonValid=true;
        this.runButtonStatus=true;
       
        //console.log('useris', this.dataValidStatus)
        this.utilityService.setSaveButton(true);
        this.utilityService.setUserStatus(true);
      
      }
      else {
        this.dataValidStatus = true
        this.projectFormGroupValid=true;
        //console.log('useris', this.dataValidStatus)
       this.utilityService.setUserStatus(false);
       this.utilityService.setSaveButton(false);
       
       
       //this.utilityService.setLoadFilesButton(true);
        //this.utilityService.setSaveButton(this.dataValidStatus);
      this.projectFormGroup.disable();

      // this.loadfilesFormGroup.disable();
      
      }
      
      

      this.projectFormGroup.patchValue({

        id: this.currentJob.jobid,
        name: this.currentJob.jobName,
        location: this.currentJob.location,
        tavg: this.currentJob.tavg,
        tmin:this.currentJob.tmin,
        tmax:this.currentJob.tmax,
      });
      this.recidforRun=this.currentJob.recId
      this.compressorList = this.currentJob.exCompressorDetails;
      this.filepath=this.currentJob.exFilePathData;

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
    console.log(this.currentJob,"&00,",this.filepath)


  },
  (error) => {//Error callback
   console.error('error caught in component')
   this.errorMessage = error;
   this.hideloader();

   alert(this.errorMessage.error.message+",Error in loading data, Please try again")

 });
}

compDetailChange(event: CompressorData) {

  this.compDetailsValid = event.valid;
  if (event.valid) {
    this.compressorList = event.data;
  }
  //console.log("cmp valid is", this.compDetailsValid,"and project is", this.projectFormGroup.valid)

}

 onNewBtnClick(){
  sessionStorage.clear();
  this.runButtonValid=false;
  this.router.navigateByUrl('ex5/new');
  this.resetProjectForm();
  this.compressorList = null;

  this.tempStattavg=false;
  this.tempStattmin=false;
  this.tempStattmax=false;

this.showCompressorDetails = false;
  this.utilityService.version$.next({
    enabled: false,
    value: null
  });
  this.dataValidStatus=true;
  this.utilityService.setUserStatus(true);
  this.projectFormGroupValid=false;
  // updated on 22/06/2022
  this.fileName = null;
  this.inputFileLocation = null;
  this.showCompressorDetails = false;
  this.dataSource = null;
  this.fileUpload.nativeElement.value = "";
  //updated on 18-05-2022
  this.utilityService.setLoadFilesButton(false);
  this.utilityService.setRunButton(false);
  this.compDetailsValid=false;
  this.LoadFilesUploadVal=false;
  //this.dataValidStatus=false;
 }

 ngOnInit(): void {
  
  sessionStorage.clear();
  this.dataValidStatus = false;
  this.projectFormGroupValid=false;
  this.runButtonValid=false;
  this.utilityService.setUserStatus(true);
  this.dataValidStatus=true;
  this.utilityService.getUsername$.subscribe(data => {
    this.userName = data;
    
  });
 
  //updated on 18/05/2022
  this.utilityService.runButtonStatus$.subscribe(data => {

    this.runButtonStatus=data;

  });

  let randomId = Math.floor(Math.random() * 100) + 1;
  this.createFormGroup();


  this.route.paramMap.subscribe((params) => {
    //console.log(params)
    if (params.get('id')) {
      this.dataIdFOrEdit=parseInt(params.get('id'));
      const jobId = parseInt(params.get('id'));
      this.jbId=jobId;
      this.editMode = true;

      this.fillDataByJobId(jobId);
    } else { // New Job 
      this.createFormGroup();
      this.seal = null;
      this.hl1 = null;
      this.hl2= null;
      this.Jbavg=null;

    }

  });

  this.utilityService.loadFilesButton$.subscribe(data => {
    this.setLoadStatus = data;
    //this.projectFormGroupValid=false;
  })
  this.utilityService.loadFileStatus$.subscribe(data=>{
    this.LoadFilesUploadVal = data;
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

onRunBtnClickEx5(event)
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
      jobid: 0,
    }
    
    // const dialogRef = this.dialog.open(Ex5LoginComponent, {data: loadData });
    // dialogRef.afterClosed().subscribe(data => { 
    //   if(data=="saved")
    //   {
      var storedpath=JSON.parse(sessionStorage.getItem("logindata")); 

      // this.botStat.jobRecId=this.recidforRun;
      // this.botStat.ssoid=storedpath[0];
      // this.botStat.password=storedpath[1];
      // this.botStat.status="Bot-Triggered";
      // this.botStat.toolId=2;

      this.datapass.push({ jobRecId: this.recidforRun,password: this.userName, ssoid: this.userName,status:"Bot-Triggered",toolId:1 })
            this.botStat=this.datapass[0]
            console.log("run in",this.botStat)

      const subscription = this.utilityService.botStat(this.botStat).subscribe(data1 => {
        if(data1){

          // var a = document.getElementById('anchor') as HTMLAnchorElement;
          //     a.href="test:";
              this.datapass.pop();

        }

      });
    //}
    //});
   
    
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


  ValidateTempMin(e,type)
  {
    this.tempStattmin=false;
   


    if(type=="tmin")
    {
    if(this.projectFormGroup.controls.tmin.value<-200)
    {
      this.tempStattmin=true;
      this.tempmessagetmin="Temperature Minimum (TMin) limit is -200 °C";
    }    
    if(this.projectFormGroup.controls.tmin.value>70)
    {
      this.tempStattmin=true;
      this.tempmessagetmin="Temperature Maximum (TMax) limit is 70 °C";
    } 

    
      if(this.projectFormGroup.controls.tmax.value!="")
      {
        if(this.projectFormGroup.controls.tmin.value>=this.projectFormGroup.controls.tmax.value)
        {
          this.tempStattmin=true;
          //alert('t-Min sholud be lesser that t-Max')
          this.tempmessagetmin= "T-Min sholud be lesser that T-Max";
        }
        else{
          this.tempStattmax=false;
        }
      }
      if(this.projectFormGroup.controls.tavg.value!="")
      {
        if(this.projectFormGroup.controls.tmin.value>=this.projectFormGroup.controls.tavg.value || 
          this.projectFormGroup.controls.tmax.value<=this.projectFormGroup.controls.tavg.value )
        {
          this.tempStattavg=true;
          this.tempmessagetavg="Temperature Average (TAvg) shoud be greater than TMin";
    
        }
        else{
          this.tempStattavg=false;
        }

      }
    }
  }
  ValidateTempMax(e,type)
  {
 
    this.tempStattmax=false;

    if(type=="tmax")
    {
    if(this.projectFormGroup.controls.tmax.value<-200)
    {
      this.tempStattmax=true;
      this.tempmessagetmax="Temperature Minimum (TMin) limit is -200 °C";
    }    
    if(this.projectFormGroup.controls.tmax.value>70)
    {
      this.tempStattmax=true;
      this.tempmessagetmax="Temperature Maximum (TMax) limit is 70 °C";
    } 
      if(this.projectFormGroup.controls.tmin.value!="")
      {
        if(this.projectFormGroup.controls.tmax.value<=this.projectFormGroup.controls.tmin.value)
        {

          this.tempStattmax=true;
          //alert('T-Max sholud be greater that T-Min')
          this.tempmessagetmax= "T-Max sholud be greater that T-Min";         
          return false;
        }
        else{
          this.tempStattmin=false;
        }
       
      }
      if(this.projectFormGroup.controls.tavg.value!="")
      {
        if(this.projectFormGroup.controls.tmax.value<=this.projectFormGroup.controls.tavg.value || 
          this.projectFormGroup.controls.tmin.value>=this.projectFormGroup.controls.tavg.value )
        {
          this.tempStattavg=true;
          this.tempmessagetavg="Temperature Average (TAvg) shoud be less than tmax";
    
        }
        else{
          this.tempStattavg=false;
        }

      }
    }
  }
  ValidateTempAvg(e,type)
  {
    this.tempStattavg=false;

   
    if(type=="tavg")
    {
    if(e.target.value<-200)
    {
      this.tempStattavg=true;
      this.tempmessagetavg="Temperature Average (TAvg) limit is -200 °C";
    }
    
    
    if(e.target.value>70)
    {
      this.tempStattavg=true;
      this.tempmessagetavg="Temperature  Average (TAvg) limit is 70 °C";
    }

    if(this.projectFormGroup.controls.tavg.value<=this.projectFormGroup.controls.tmin.value || this.projectFormGroup.controls.tavg.value>=this.projectFormGroup.controls.tmax.value)
    {
      this.tempStattavg=true;
      this.tempmessagetavg="Temperature Average (TAvg) shoud be less than TMax and greater than TMin";
    }
  }
 
  }
  allowNumericDigitsOnlyOnKeyUp(e,type){


  

    //console.log(type);
    var charCode = e.which ? e.which : e.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)){
      e.preventDefault();
      if(type=="tavg"){
        this.msg =
        "Only numeric and decimal values are allowed";
      }
      else if(type=="tmin"){
        this.msg1=
        "Only numeric and decimal values are allowed";
      }
else {
  this.msg2=
  "Only numeric and decimal values are allowed";
}
     
      
      
      return false;
    }
    this.msg = '';
    this.msg1= '';
    this.msg2= '';
    return true;
    
  }
  }

 export interface AdfFileDetail {
  id: number,
  name: string;
  
  
}

  
 
