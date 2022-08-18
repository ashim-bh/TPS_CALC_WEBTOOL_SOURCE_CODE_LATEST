import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import {Router} from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilityService } from '@core/services/utility.service';
import { UserDetails } from '@core/models/userdetails';
@Component({
  selector: 'tps-registerpage',
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.scss']
})
export class RegisterpageComponent implements OnInit {
registerform:FormGroup;
  
  style: any;
  _snackBar: any;
  Message: string;

  userdetails:UserDetails;
  spinenabled: boolean;
  
  constructor(private router: Router,private utilityService: UtilityService) { }
  
hide:boolean=false; 
show:boolean=false;


  // Message:string;
  
submit(event){
  this.spinenabled=true;

  this.userdetails=this.registerform.value
//  this.userdetails.mail=this.registerform.controls.mail.value;
//  this.userdetails.owner=this.registerform.controls.owner.value;
//  this.userdetails.password=this.registerform.controls.password.value;
//  this.userdetails.ssoid=this.registerform.controls.ssoid.value;
 //console.log("user details",this.userdetails);
 
 

  const subscription = this.utilityService.registationAPI(this.userdetails).subscribe(data => {
    if (data) {    
      this.spinenabled=false;

      //console.log(this.registerform.value)
      alert("User Registered Successfully");
      //console.log(this.Message);
      this.router.navigate([""]);
    }
  })
  
 
}
registerFormGroup() {
  this.registerform = new FormGroup({
    ssoidOrBhid: new FormControl('', Validators.required),
    mail:new FormControl('', Validators.required),
    passwordcheck: new FormControl('', Validators.required),
    owner:new FormControl('', Validators.required),
    password:new FormControl('', Validators.required),

    
  });
}
check()
{
  
  if(this.registerform.controls.password.value==this.registerform.controls.passwordcheck.value)
  {
    //console.log("correct!!!!!!")
  }
  else{
    //console.log("wrong password")
  }
  
}
  ngOnInit(): void {
    this.registerFormGroup();
    // this.registerform.patchValue({

    //   ssoidOrBhid:this.userdetails.ssoidOrBhid,
    //   mail: this.userdetails.mail,
    //   owner: this.userdetails.owner,
    //   password:this.userdetails.password,
    // });
  }
 // get passwordInput() { return this.registerform.get('password'); }  
}
