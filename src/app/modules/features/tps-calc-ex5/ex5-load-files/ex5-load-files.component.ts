import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ex5JobRecordUIModel } from '@core/models/Ex5JobRecordUIModel';
import { loadFilesModelDataEx5 } from '@core/models/loadFilesModelEx5';
import { UtilityService } from '@core/services/utility.service';
import { TpsDialogComponent, tpsDialogData } from '@shared/dialog/components/tps-dialog.component';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'tps-ex5-load-files',
  templateUrl: './ex5-load-files.component.html',
  styleUrls: ['./ex5-load-files.component.scss']
})
export class Ex5LoadFilesComponent implements OnInit {

  @ViewChild('fileUpload10') fileUpload10: ElementRef;
  @ViewChild('fileUpload11') fileUpload11: ElementRef;
  @ViewChild('fileUpload12') fileUpload12: ElementRef;

  loadfilesFormGroup: FormGroup;
  studyLocCo1: string; studyLocCo2: string; studyLocCo3: string;
  loadfilesFormGroupStat: boolean;
  valid = false;
  img1: boolean;
  count = 0;
  filecount = 0;
  compArr: any[];
  portArr: any[];
  loadFileValuesEx5 = new Map<string, number>();
  loadFileValuesEx51 = new Array<{ compressor: any }>();
  loadmode=false;
  currentJob: Ex5JobRecordUIModel;
  studyCo1 = false; studyCo2 = false; studyCo3 = false;
  studyLocC1: any;
  studyLocC2: any;
  studyLocC3: any;
  dataUserStatus: boolean;
  Comp1: string; Comp2: string; Comp3: string;
  filePaths: loadFilesModelDataEx5[];
  filepaths = new Array<{co1Prt1Prtpath:string,co2Prt2Prtpath:string,co3Prt3Prtpath:string}>();
  validatebtn: boolean;
  p1Valid: boolean;
  p2Valid: boolean;
  p3Valid: boolean;
  errorMessage: any;

  constructor(public dialogRef: MatDialogRef<Ex5LoadFilesComponent>, private utilityService: UtilityService, 
    private fb: FormBuilder, public dialog: MatDialog,private httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: loadFilesData) { }

  ngOnInit(): void {

    this.loadmode=false;
    this.createFormGroup();
    const jobId = this.data.jobid;
    this.loadfilesFormGroupStat = false;
    this.utilityService.nonCurrentUser$.subscribe(userData => {
    this.dataUserStatus = userData;
    });

    this.loadfilesFormGroupStat = false;
    this.utilityService.getDetailsEx5$.subscribe(data => {
    this.loadFileValuesEx51 = data

    })
    this.loadFileValuesEx51.forEach(item => {
      if (item.compressor == "Compressor 1") {
        this.studyCo1 = true;
        this.filecount++;
      }
      if (item.compressor == "Compressor 2") {
        this.studyCo2 = true;
        this.filecount++;
      }
      if (item.compressor == "Compressor 3") {
        this.studyCo3 = true;
        this.filecount++;
      }
    });

    //added by ashim for edit mode
    if (this.data.editMode) {
      this.filecount=0;
      this.loadmode=true;
      this.fillDataByJobId(jobId);
      this.loadfilesFormGroupStat=true;
      this.utilityService.getDetailsEx5$.subscribe(dataitems => {
      this.loadFileValuesEx51 = dataitems
      })
      this.loadFileValuesEx51.forEach(item => {

        if (item.compressor == "Compressor 1") {
          this.studyCo1 = true;
          this.filecount++;
        }
        if (item.compressor == "Compressor 2") {
          this.studyCo2 = true;
          this.filecount++;
        }
        if (item.compressor == "Compressor 3") {
          this.studyCo3 = true;
          this.filecount++;
        }
      });
     
    }
   
    else {
     var storedFilepath = JSON.parse(sessionStorage.getItem("load_filepath"));
      //console.log("in home storage is:", storedFilepath)
      if (storedFilepath) {
        this.studyLocC1 = storedFilepath[0]; this.studyLocC2 = storedFilepath[1]; this.studyLocC3 = storedFilepath[2];
        //console.log(this.filecount, "and files ", this.loadfilesFormGroup);
      }
      else {
        this.studyLocC1 = null; this.studyLocC2 = null; this.studyLocC3 = null;
      }
      storedFilepath.forEach(element => {
        if (element != null)
          this.count++;
      });

      if (this.count >= this.filecount) {
        this.loadfilesFormGroupStat = true;
      }
    }

    if (this.count >= this.filecount) {
      this.loadfilesFormGroupStat = true;
    }
    else{
      this.loadfilesFormGroupStat = false;

    }
    
  }

  hideloader() {
    // Setting display of spinner
    // element to none
    document.getElementById('loading').style.display = 'none';
  }
  fillDataByJobId(jobId) {
    this.count=0;
    const jobEdit='http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/Ex/get-by-jobId/'+jobId+',1';
    //const subscription = this.utilityService.getJobListEx5().subscribe(data => {
      const subscription1 = this.utilityService.getJobListEditEX(jobEdit).subscribe(data => {
    if (data) {
        this.hideloader();
        this.loadmode=false;
       this.currentJob = data;
        //console.log("data in edit load", this.currentJob)
        this.filePaths = this.currentJob.exFilePathData;
        this.filePaths.forEach(element => {
          this.Comp1 = element.co1Prt1Prtpath;
          this.Comp2 = element.co2Prt2Prtpath;
          this.Comp3 = element.co3Prt3Prtpath;
        })

        this.currentJob.exCompressorDetails.forEach(element => {
          if (element.checkedStatus) {
            if (element.compType == "Compressor 1") {
              this.studyLocC1 = this.Comp1;
              this.count++;

            }
            if (element.compType == "Compressor 2") {
              this.studyLocC2 = this.Comp2;
              this.count++;
            }
            if (element.compType == "Compressor 3") {
              this.studyLocC3 = this.Comp3;
              this.count++;
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
      //console.log("job detail is", this.currentJob)
    },
    (error) => {//Error callback
     console.error('error caught in component')
     this.errorMessage = error;

     alert(this.errorMessage.error.message+",Error in Loading datd,please try again")

   });
  }

  createFormGroup() {
    this.loadfilesFormGroup = this.fb.group({
      studyLocCo1: new FormControl('', Validators.required), studyLocCo2: new FormControl('', Validators.required), studyLocCo3: new FormControl('', Validators.required),
    });
  }

  onBtnClick() {
    this.filepaths.push({co1Prt1Prtpath:this.studyLocC1,co2Prt2Prtpath:this.studyLocC2,co3Prt3Prtpath:this.studyLocC3});
    var filePaths = [this.studyLocC1, this.studyLocC2, this.studyLocC3];
    sessionStorage.setItem("load_filepath", JSON.stringify(filePaths)); //store colors
    sessionStorage.setItem("load_filepath_save", JSON.stringify(this.filepaths)); //store colors
    this.utilityService.setLoadStstus(true);
    this.dialogRef.close();
  }

  imgPrt() {
    this.img1 = true;
  }

  filePrt() {
    this.img1 = false;
  }

  getFolder (urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
     
    return xhr.status !== 404;
}

  onClick(event, data) {
    if (data == "prtCo1") {
      this.studyLocC1 = (event.target.value).replaceAll('"','');
      if (this.studyLocC1 && this.validateFilePrt(this.studyLocC1, "prtCo1")) {
        this.loadfilesFormGroup.patchValue({
          studyLocCo1: this.studyLocC1
        });
        this.count++;
      }
      //this.getFolder(this.studyLocC1)
            
    }
    else if (data == "Co2") {
      this.studyLocC2 = (event.target.value).replaceAll('"','');
      if (this.studyLocC2 && this.validateFilePrt(this.studyLocC2, "Co2")) {
        this.loadfilesFormGroup.patchValue({
          studyLocCo2: this.studyLocC2
        });
        this.count++;
      }

    }
    else if (data == "Co3") {
      this.studyLocC3 = (event.target.value).replaceAll('"','');
      if (this.studyLocC3 && this.validateFilePrt(this.studyLocC3, "Co3")) {
        this.loadfilesFormGroup.patchValue({
          studyLocCo3: this.studyLocC3
        });
        this.count++;
      }
    }
    if (this.count >= this.filecount) {
      //this.validatebtn=true;
      this.loadfilesFormGroupStat = true;
    }
  }
  onInput(event) {

  }
  // onFileSelected(event, data) {
  //   //console.log("inside sta", data)
  //   const file: File = event.target.files[0];
  //   //console.log(file)


  //   if (data == "prtCo1") {
  //     if (file && this.validateFilePrt(file, "prtCo1")) {
  //       this.studyLocC1 = event.path[0].value;
  //       this.loadfilesFormGroup.patchValue({
  //         studyLocCo1: event.path[0].value
  //       });
  //       this.count++;
  //     }
  //   }
  //   if (data == "Co2") {
  //     if (file && this.validateFilePrt(file, "Co2")) {
  //       this.studyLocC2 = event.path[0].value;
  //       this.loadfilesFormGroup.patchValue({
  //         studyLocCo2: event.path[0].value
  //       });
  //       this.count++;
  //     }
  //   }
  //   if (data == "Co3") {
  //     if (file && this.validateFilePrt(file, "Co3")) {
  //       this.studyLocC3 = event.path[0].value;
  //       this.loadfilesFormGroup.patchValue({
  //         studyLocCo3: event.path[0].value
  //       });
  //       this.count++;
  //     }
  //   }

  //   //console.log("count", this.count, "file", this.filecount)


  //   if (this.count >= this.filecount) {
  //     this.loadfilesFormGroupStat = true;
  //   }

  // }

  validateFilePrt(file: string, str: string) {


    const isFileValid = file.split('.')[1] === 'prt' ? true : false;
    // this.loadfilesFormGroupStat=false;
    if(isFileValid)
    {
      if (str == "prtCo1") {

      this.p1Valid=true;
      }
      if (str == "Co2") {
        this.p2Valid=true;
      }
      if (str == "Co3") {
        this.p3Valid=true;
      }

    }
    if (!isFileValid) {
     if (str == "prtCo1") {
      this.p1Valid=false
        this.loadfilesFormGroup.patchValue({
          studyLocCo1: null
        });
      }
      else if (str == "Co2") {
        this.p2Valid=false
        this.loadfilesFormGroup.patchValue({
          studyLocCo2: null
        });
      }
      else if (str == "Co3") {
        this.p3Valid=false
        this.loadfilesFormGroup.patchValue({
          studyLocCo3: null
        });
      }
      const dialogData: tpsDialogData = {
        modalTitle: 'Invalid File Format',
        customTemplate: false,
        modalContent: 'Select a proper PRT file ',
        primaryBtnText: 'Ok',
      }
      const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        //console.log(result);
      });
    }
    //this.loadfilesFormGroupStat=false;
    return isFileValid;
  }




  onFileResetBtnClick(data: string) {
    //console.log(data)
    if (data == "prtCo1") {
      this.p1Valid=false
      this.count = this.count - 1;
      //console.log("3", this.count);
      this.studyLocC1 = null;
      this.loadfilesFormGroupStat = false;
    }
    if (data == "Co2") {
      this.p2Valid=false
      this.count = this.count - 1;
      //console.log("3", this.count);
      this.studyLocC2 = null;
      this.loadfilesFormGroupStat = false;

    }
    if (data == "Co3") {
      this.p3Valid=false
      this.count = this.count - 1;
      //console.log("3", this.count);
      this.studyLocC3 = null;
      this.loadfilesFormGroupStat = false;
    }
     if (this.count >= this.filecount) {
      this.loadfilesFormGroupStat = true;
    }
  }

  onClose() {
    this.dialogRef.close();
  }
  onInfo() {
    const dialogData: tpsDialogData = {
      modalTitle: 'Invalid File Format',
      customTemplate: false,
      modalContent: 'Select a proper PRT (.prt) file ',
      primaryBtnText: 'Ok',
    }
  }
}
export interface loadFilesData {
  customTemplate: boolean;
  primaryBtnText?: string;
  secondaryBtnText?: string;
  editMode?: boolean;
  jobid: number;
}