import { ThrowStmt } from '@angular/compiler';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from '@core/services/utility.service';


@Component({
  selector: 'tps-dialog',
  templateUrl: './tps-dialog.component.html',
  styleUrls: ['./tps-dialog.component.scss']
})
export class TpsDialogComponent {

  fileName: string = null;
  editMode=false;
  disabled=false;
  validStat=false;

  constructor(public dialogRef: MatDialogRef<TpsDialogComponent>,public utilService:UtilityService,
    @Inject(MAT_DIALOG_DATA) public data: tpsDialogData) { }
    

  onPrimaryBtnClick() {
    
    this.dialogRef.close(this.fileName);
  
  }

  onSecondaryBtnClick() {
    this.dialogRef.close("revision");
  }

  onTertiaryBtnClick() {
    this.dialogRef.close("closed");
  }

  ngOnInit(): void {
    this.fileName = this.data.modalContent;
    this.utilService.revisionStatus$.subscribe(data=>{
      this.editMode=data;
      //console.log(this.editMode)
      if(this.editMode)
      {
        this.disabled=true;
      }
  })
  if(!this.editMode)
  {  
  this.utilService.saveButtonStatus$.subscribe(data=>{
    //console.log('save:',data)
    if(data)
    this.validStat=false;
    else    this.validStat=true;
  })
}
if(this.data.modalTitle!="Save Project")
{
  this.validStat=false;
}

}
}

export interface tpsDialogData {
  modalTitle: string;
  customTemplate: boolean;
  modalContent?: string;
  primaryBtnText?: string;
  seondaryBtnText?: string;
  tertiaryBtnText?: string;
  primaryBtnVisibility?: boolean;
  secondaryBtnVisibility?: boolean;
  tertiaryBtnVisibility?: boolean;
}
