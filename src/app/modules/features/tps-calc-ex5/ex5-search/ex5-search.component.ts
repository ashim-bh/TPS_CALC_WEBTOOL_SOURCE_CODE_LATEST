import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterEvent } from '@angular/router';
import { BOtStatus } from '@core/models/botStstusModel';
import { Ex5JobRecordUIModel } from '@core/models/Ex5JobRecordUIModel';
import { UtilityService } from '@core/services/utility.service';
import { TpsDialogComponent, tpsDialogData } from '@shared/dialog/components/tps-dialog.component';
import { HttpClient } from '@angular/common/http';


import { Subscription } from 'rxjs';

@Component({
  selector: 'tps-ex5-search',
  templateUrl: './ex5-search.component.html',
  styleUrls: ['./ex5-search.component.scss']
})
export class Ex5SearchComponent implements OnInit {
  searchFormGroup: FormGroup;
  displayedColumns = ['id', 'name', 'owner', 'date', 'botstatus', 'actions'];
  Message: string; userName: string;

  dataSource: MatTableDataSource<Ex5JobRecordUIModel>;
  jobListEx5: Ex5JobRecordUIModel[] = [];
  private dataSubList: Subscription[] = [];
  durationInSeconds = 2;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  JobRecordUIModel: Ex5JobRecordUIModel[];
  isDisabled: boolean;
  botValStatNew = false;
  botValStatRun = false;
  botValStatSuccess = false;
  botValStatFailed = false;
  botValStatStopped = false;
  botVal: string;
  classBotVal: any;
  botStatus: BOtStatus;
  StatFind: boolean;
  style: string;
  modalContent: any;
  status: string;
  reload: boolean=true;
  errorMessage: any;

  constructor(public dialog: MatDialog, private utilityService: UtilityService, private _snackBar: MatSnackBar, private http: HttpClient) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = this.jobFilterPredicate();

  }
   hideloader() {
  
    // Setting display of spinner
    // element to none
    document.getElementById('loading')
        .style.display = 'none';
}

  ngOnInit(): void {
    sessionStorage.clear();
    // Create Search Formgroup
    this.createFormGroup();
    // Create 100 project records
    const subscription = this.utilityService.getJobListEx5().subscribe(data => {
      if (data) {
        this.hideloader();
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.data.forEach(element => {
          if (element.owner.toLowerCase() == this.userName.toLowerCase())
            element.userStatus = true;
          else
            element.userStatus = false;
        });
        this.dataSource.filterPredicate = this.jobFilterPredicate();
        this.jobListEx5 = data;// existing collection
        this.dataSource.paginator = this.paginator;
      }
      this.utilityService.getUsername$.subscribe(data => {
        this.userName = data;
      })
      
    },
    (error) => {//Error callback
     console.error('error caught in component')
   this.errorMessage = error;
     alert(this.errorMessage.error.message+ ",error in fetching data.. Please try Reload the Page if the problem exist try after Some time")   
     this.hideloader();

    });
    

    // for (let i = 1; i <= 100; i++) { this.projects.push(this.createNewRecord()); }  
    const subsciption = this.utilityService.getUsername$.subscribe((data: string) => {
      if (data) this.userName = data;
    })

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.setPagination();



  }
  setPagination() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  jobFilterPredicate() {


    const myFilterPredicate = (data: ProjectRecordModel, filter): boolean => {
      const filterParams = JSON.parse(filter);
      let status = true;
      if (filterParams.recId) {
        status = (data.recId).toFixed(2).toString().startsWith(filterParams.recId) ? true : false;
        //console.log(status);
        if (status) {
          this.StatFind = true;
        }

      }
      // //console.log(status);
      if (filterParams.projectName) {
        status = status ? (data.jobName.toLowerCase().indexOf(filterParams.projectName.toLowerCase()) !== -1 ? true : false) : false;
        if (status) {
          this.StatFind = true;
        }
      }
      // //console.log(status);

      if (filterParams.ownerName) {
        status = status ? (data.owner.toLowerCase().indexOf(filterParams.ownerName.toLowerCase()) !== -1 ? true : false) : false;
        if (status) {
          this.StatFind = true;
        }
      }
      ////console.log(status);


      //from date to date Filtering
      if (filterParams.fromDate) {
        if (filterParams.toDate) {

          if (filterParams.fromDate == filterParams.toDate) {
            status = status ? ((new Date(data.creationdate).toLocaleDateString() == new Date(filterParams.fromDate).toLocaleDateString()) &&
              (new Date(data.creationdate).toLocaleDateString() == new Date(filterParams.toDate).toLocaleDateString()) ? true : false) : false;

            if (status) {
              this.StatFind = true;

            }
          }
          else {
            status = status ? ((new Date(data.creationdate).getTime() >= new Date(filterParams.fromDate).getTime()) &&
              ((new Date(data.creationdate).getTime()) <= new Date(filterParams.toDate).getTime() + 86400000) ? true : false) : false;
            if (status) {

              this.StatFind = true;
            }
          }
        }
        else {
          //console.log('dates are', new Date(data.creationdate).getTime(), new Date(filterParams.fromDate).getTime());
          status = status ? ((new Date(data.creationdate).getTime() >= new Date(filterParams.fromDate).getTime()) ? true : false) : false;
          if (status) {
            this.StatFind = true;

          }

        }
        return status;
      }
      else if (filterParams.toDate) {
        status = status ? (((new Date(data.creationdate).getTime() ) <= new Date(filterParams.toDate).getTime()+ 86400000) ? true : false) : false;
        if (status) {

          this.StatFind = true;
        }
      }

      // if (filterParams.toDate) {
      // status = status ? ((new Date(data.date).toLocaleDateString() <= new Date(filterParams.toDate).toLocaleDateString()) ? true : false) : false;
      //}
      return status;

    }
    //console.log(this.StatFind)

    return myFilterPredicate;

  }


  onKeydown(event) {
    this.onSearchBtnClick();

  }

  onClearBtnClick() {
    this.searchFormGroup.reset();
    this.dataSource = new MatTableDataSource(this.jobListEx5);
    this.dataSource.filterPredicate = this.jobFilterPredicate();
    this.dataSource.paginator = this.paginator;
    this.paginator._changePageSize(5);
    

  }
  onSearchBtnClick() {
    const filterParams: FilterParams = this.searchFormGroup.value;
    if (this.searchFormGroup.pristine == true) {
      this.Message = "No Search Criteria, Atleast one Criteria Needed";
      this.style="custom-style-error";
      this.openSnackBar1();
    }
    else {
      if (filterParams.fromDate) {
        if (filterParams.toDate) {

          if (new Date(filterParams.fromDate).getTime() > new Date(filterParams.toDate).getTime()) {
            this.Message = 'Invalid Date Entry : From Date should be smaller than To Date';
            this.style="custom-style-error";
            this.openSnackBar1();

          }
        }
      }
      this.dataSource.filter = JSON.stringify(filterParams);
      if(!this.StatFind)
      {
        this.Message="error! 0 Records found!";
        this.style="custom-style-error";
        this.openSnackBar1();
      }
    }
  }
  onDelBtnClick(id) {
    this.reload=false;
    const project = this.dataSource.data.find(p => p.jobid === id);
    //console.log(project)
    const dialogData: tpsDialogData = {
      modalTitle: 'Delete Project',
      customTemplate: false,
      modalContent: `Do you want to delete '${project.jobName}'`,
      primaryBtnText: 'Yes',
      tertiaryBtnText: 'Cancel'
    }
    this.modalContent="Do you want to delete '"+ project.jobName+"'";
    const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData,disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      document.getElementById('loading').style.display = '';

      //console.log(`Dialog result: ${result}`, result);
      //updated on 10-05-2022
      if(result==this.modalContent)
      {
        const deleteAPI="http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/Ex/delete-job/"+id+",1";
        this.http.delete(deleteAPI).subscribe(data =>{
          if(data){
            this.hideloader();
          //console.log(this.status)
          //console.log(result,"this is",this.modalContent)
          this.Message='Record Deleted';
          this.style="custom-style-success";
          this.openSnackBar1();
          if(this.reload)
      {
        setTimeout(function(){
          window. location. reload();
       }, 3000);      }
          }
        },
        (error) => {//Error callback
         console.error('error caught in component')
       this.errorMessage = error;
         alert(this.errorMessage.error.message+",Please try Deleting again");
       });   
      }
      
      
      this.dataSource.filterPredicate = this.jobFilterPredicate();
      //this.jobListEx5 = data;// existing collection
      this.dataSource.paginator = this.paginator;

      // else
      // {
      //   this.Message='process Cancelled';
      // }

    });
    }

  openSnackBar() {
    this._snackBar.open(this.Message, 'Ok', {
      verticalPosition: 'bottom',
      duration: 2500,
    });
  }
  openSnackBar1() {
    this._snackBar.open(this.Message, 'OK', {
      verticalPosition: 'bottom',
      duration: 2500,
      panelClass:this.style


    });
    this.reload=true;

  }
  ngOnDestroy(): void {

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




  createFormGroup() {
    this.searchFormGroup = new FormGroup({
      recId: new FormControl(null),
      projectName: new FormControl(null),
      ownerName: new FormControl(null),
      fromDate: new FormControl(null),
      toDate: new FormControl(null),
    });
  }
}

export interface ProjectRecordModel {
  jobid: number;
  recId: number;
  jobName: string;
  owner: string;
  creationdate: number;
  userStatus: boolean;
}
export interface FilterParams {
  recId: number;
  projectName: string;
  ownerName: string;
  fromDate: number;
  toDate: number;
}

