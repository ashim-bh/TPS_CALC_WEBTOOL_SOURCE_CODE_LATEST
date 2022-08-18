import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { UtilityService } from '@core/services/utility.service';
@Component({
  selector: 'tps-ex5-login',
  templateUrl: './ex5-login.component.html',
  styleUrls: ['./ex5-login.component.scss']
})
export class Ex5LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  formLogin: FormGroup;
  userName: string;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      public dialogRef:MatDialogRef<Ex5LoginComponent>,
      // private alertService: AlertService,
      private utilityService: UtilityService
      ) { }

 

  ngOnInit(): void {
    this.utilityService.getUsername$.subscribe(data => {
      if (data) 
      {
        this.userName = data;
      }
    })
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


