import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { UtilityService } from '@core/services/utility.service';

@Component({
  selector: 'tps-cal55-login',
  templateUrl: './cal55-login.component.html',
  styleUrls: ['./cal55-login.component.scss']
})
export class Cal55LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  returnUrl: string;
  formLogin: FormGroup;
  userName: string;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      public dialogRef:MatDialogRef<Cal55LoginComponent>,
      private utilityService:UtilityService,
      // private alertService: AlertService
      ) { }

  ngOnInit() {
    this.utilityService.getUsername$.subscribe(data => {
      if (data) 
      {
        this.userName = data;
      }
    })
     
      // reset login status
     // this.authenticationService.logout();

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.createFormGroup();
  }

  login() {

    var details=[this.formLogin.value.username,this.formLogin.value.password]
    sessionStorage.setItem("logindata", JSON.stringify(details));
    this.dialogRef.close("saved");
    
    
  }
  createFormGroup() {
    this.formLogin = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      
    });
  }
}
