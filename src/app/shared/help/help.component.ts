import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'tps-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  calc55Stat: boolean;
  ex5Stat: boolean;

  constructor(public dialogRef: MatDialogRef<HelpComponent> ,
    @Inject(MAT_DIALOG_DATA) public data: tpsHelpData){}
  ngOnInit(): void {
    if(this.data.modalContent=="Calc55")
    {
      this.calc55Stat=true;
      this.ex5Stat=false;
    }
    if(this.data.modalContent=="Ex5")
    {
      this.calc55Stat=false;
      this.ex5Stat=true;
    }

  }

  onBtnClick() {
    this.dialogRef.close();
  }
 
}
export interface tpsHelpData {
  modalTitle: string;
  customTemplate: boolean;
  modalContent: string;
  primaryBtnText?: string;
  
  
}