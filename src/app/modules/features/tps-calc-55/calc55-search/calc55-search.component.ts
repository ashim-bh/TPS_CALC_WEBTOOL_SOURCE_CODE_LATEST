import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { JobRecordUIModel } from '@core/models/JobRecordUIModel';

import { UtilityService } from '@core/services/utility.service';

import { Subscription } from 'rxjs';

import { TpsDialogComponent, tpsDialogData } from 'src/app/modules/shared/dialog/components/tps-dialog.component';

@Component({
  selector: 'tps-calc55-search',
  templateUrl: './calc55-search.component.html',
  styleUrls: ['./calc55-search.component.scss']
})
export class Calc55SearchComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['id', 'name', 'owner', 'date', 'botstatus', 'actions'];
  Message: string; userName: string;
  searchFormGroup: FormGroup;
  dataSource: MatTableDataSource<JobRecordUIModel>;
  jobList: JobRecordUIModel[] = [];
  private dataSubList: Subscription[] = [];
  durationInSeconds = 2;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  JobRecordUIModel: JobRecordUIModel[];
  isDisabled: boolean; sub: any;
  modalContent: any;

  StatFind: boolean;
  style: string;
  status: string;
  reload: boolean;
  errorMessage: any;


  constructor(public dialog: MatDialog, private utilityService: UtilityService, private _snackBar: MatSnackBar, private route: ActivatedRoute,private http: HttpClient) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = this.jobFilterPredicate();

  }

  /** Builds and returns a new  project record. */
  //  createNewRecord(): ProjectRecordModel {
  //   return {
  //   id: (Math.floor(Math.random() * 100.0) + 1) + .1,
  //     version: (Math.floor(Math.random() * 100.0) + 1) + .1,
  //   name: `Athena_${Math.floor(Math.random() * 100) + 1}`,
  //   owner: `User_${Math.floor(Math.random() * 100) + 1}`,
  //     date: Date.now()
  //   };
  //  }  
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
    const subscription = this.utilityService.getJobList().subscribe(data => {
      if (data) {
        this.hideloader();
        //console.log(data,this.Message,subsciption)
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.data.forEach(element => {
          if (element.owner.toLowerCase() == this.userName.toLowerCase())
            element.userStatus = true;
          else
            element.userStatus = false;
        });
        this.dataSource.filterPredicate = this.jobFilterPredicate();
        this.jobList = data;// existing collection
        this.dataSource.paginator = this.paginator;
      }
      else
      {
        this.hideloader();
        alert("error in fetching data");
      //console.log(this.Message);
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
  onKeydown(event) {
    this.onSearchBtnClick();

  }

  // Job Filter
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
        status = status ? (((new Date(data.creationdate).getTime()) <= new Date(filterParams.toDate).getTime() + 86400000) ? true : false) : false;
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

  // Search job records by filter parameters
  onSearchBtnClick() {

    const filterParams: FilterParams = this.searchFormGroup.value;
    if (this.searchFormGroup.pristine == true) {
      this.Message = "No Search Criteria, Atleast one Criteria Needed !";
      this.style = "custom-style-error";
      this.openSnackBar1();
    }
    else {


      if (filterParams.fromDate) {
        if (filterParams.toDate) {

          if (new Date(filterParams.fromDate).getTime() > new Date(filterParams.toDate).getTime()) {
            this.Message = 'Invalid Date Entry : From Date should be smaller than To Date!!!';
            this.style = "custom-style-error";
            this.openSnackBar1();

          }
        }
      }

      this.dataSource.filter = JSON.stringify(filterParams);
      if (!this.StatFind) {
        this.Message = "error! 0 Records found!";
        this.style = "custom-style-error";
        this.openSnackBar1();
      }
    }


    //console.log(filterParams)
  }

  // Reset search/filter
  onClearBtnClick() {
    this.searchFormGroup.reset();
    this.dataSource = new MatTableDataSource(this.jobList);
    this.dataSource.filterPredicate = this.jobFilterPredicate();
    this.dataSource.paginator = this.paginator;
    this.StatFind = false;
    this.paginator._changePageSize(5);

  }

  // On Delete button click
  onDelBtnClick(id) {
    document.getElementById('loading').style.display = '';
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
    this.modalContent = "Do you want to delete '" + project.jobName + "'";
    const dialogRef = this.dialog.open(TpsDialogComponent, { data: dialogData, disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`, result);
      if (result == this.modalContent) {

        const deleteAPI="http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/calc/delete-job/"+id+",2";
        this.http.delete(deleteAPI).subscribe(data=>{
          if(data)
          {
            this.hideloader();
            //console.log(result, "this is", this.modalContent)
            this.Message = 'Record Deleted';
            this.style = "custom-style-success";
            this.openSnackBar1();
            if(this.reload)
            {setTimeout(function(){
              window. location. reload();
           }, 3000);
            }
          }

         
        },
        (error) => {//Error callback
         console.error('error caught in component')
       this.errorMessage = error;
         alert(this.errorMessage.error.message+",Please try Deleting again");
       });

        
      }
      this.ngOnInit();

      this.dataSource.filterPredicate = this.jobFilterPredicate();
        //this.jobList = data;// existing collection
        this.dataSource.paginator = this.paginator;

    });


  }
  alert(arg0: string) {
    throw new Error('Method not implemented.');
  }
  openSnackBar() {
    this._snackBar.open(this.Message, 'ok', {
      verticalPosition: 'bottom',

    });

  }
  openSnackBar1() {
    this._snackBar.open(this.Message, 'ok', {
      verticalPosition: 'bottom',
      //duration: 2800,
      panelClass: this.style

    });
    this.reload=true;

  }


  setPagination() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  ngOnDestroy(): void {
    this.hideloader();
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
