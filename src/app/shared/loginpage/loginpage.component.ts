import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { UtilityService } from '@core/services/utility.service';

@Component({
  selector: 'tps-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginpageComponent implements OnInit {
  //hide:boolean;
  loginForm: FormGroup;
  route: string;
  userName: string;
  hide:boolean=true;
  spinenabled: boolean=false;
  Message: any;
  username: string;  
  password: string;  
  
  
  retnval:boolean;
  errorMessage: any;
  constructor(public router: Router,private utilityService: UtilityService, private authService: AuthenticationService) {
    
   }
  createFormGroup() {
    this.loginForm = new FormGroup({
      ssoidOrBhid: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      toolselect: new FormControl('', Validators.required),
    });
    
  }
  ngOnInit(): void {
    this.createFormGroup();
  }
  
loginBtnClick(){ 
  this.spinenabled=true;
 console.log(this.loginForm.value)
const subscription = this.utilityService.loginAPI(this.loginForm.value).subscribe(data => {
if (data) {
this.spinenabled=false;
var string=data.message+'';
var split=string.split(' ');
 this.userName=split[0];

console.log(this.userName)

const val = this.loginForm.value.toolselect;
if (val == "calc55") {
  this.route = "/calc55"
 }
else {
 this.route = "/ex5"

 }
 localStorage.setItem("username", JSON.stringify(this.userName));
this.utilityService.userLoggedStat(true);
this.utilityService.setUsername(this.userName)
this.router.navigate([this.route]);
 }
 },
 (error) => {//Error callback
  this.spinenabled=false;
  console.error('error caught in component')
this.errorMessage = error;

if(this.errorMessage.error.message=="user not found")
{
alert(this.errorMessage.error.message+", Invalid User name. Please Try Again With Correct User Name")
}
else if(this.errorMessage.error.message=="password entered is wrong")
{
alert(this.errorMessage.error.message+", Invalid Password. Please Try Again With corrext password")
}
else
{
  alert(this.errorMessage.error.message+",Please try Loging In again")
 
}



})


}
}

