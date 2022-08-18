import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { Ex5CompressorComponent } from '@features/tps-calc-ex5/ex5-compressor/ex5-compressor.component';

@Component({
  selector: 'tps-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  Message: string = null;
  l1stat: boolean;
  l2stat:boolean;
  l1:boolean;
  l2:boolean;
  color: any;

  constructor(public dialogRef: MatDialogRef<NotificationComponent> ,
    @Inject(MAT_DIALOG_DATA) public data: tpsL1L2Data)

  { }

  ngOnInit(): void {
    if(this.data.modalContent=="l1"){
      this.l1stat=true;
      this.l2stat=false;
      
    }
    if(this.data.modalContent=="l2"){
      this.l1stat=false;
      this.l2stat=true;
    }
    // this.dialogRef.afterClosed().subscribe(res => {
    //   this.color = res;
    // });

  }
  onBtnClick1(){
    this.dialogRef.close("Closed");
  }
  
}


export interface tpsL1L2Data {
  modalTitle: string;
  customTemplate: boolean;
  modalContent: string;
  primaryBtnText?: string;
  
  
}

