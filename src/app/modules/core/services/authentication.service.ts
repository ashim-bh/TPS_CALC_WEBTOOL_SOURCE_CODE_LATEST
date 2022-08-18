import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from './utility.service';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
    userName: string;
    logindetails= new Array<{ssoidOrBhid: any, password: any}>();
    errorMessage: any;
    retnval: boolean;
   
constructor(private http: HttpClient, private utilityService:UtilityService) { }

   public login(username: string, password: string) {
        this.logindetails=[]
        this.logindetails.push({ssoidOrBhid: username, password: password})
        //console.log("details at aut",this.logindetails[0])

    const subscription = this.utilityService.loginAPI(this.logindetails[0]).subscribe(data => {
      
        if (data) {
          //console.log(data)
          var string=data.message+'';
          var split=string.split(' ');
          this.userName=split[0];
          //console.log(this.userName)
          localStorage.setItem("username", JSON.stringify(this.userName));
          localStorage.setItem('currentUser', "loggedin");  
          this.retnval=true;
        }
        return true;
      },
      (error) => {//Error callback
        console.error('error caught in component')
        this.errorMessage = error;
        //console.log(this.errorMessage)
        if(this.errorMessage.error.message=="user not found")
        {
        alert(this.errorMessage.error.message+", Invalid User name. Please Try Again With Correct User Name")
        }
        if(this.errorMessage.error.message=="password entered is wrong")
        {
        alert(this.errorMessage.error.message+", Invalid Password. Please Try Again With corrext password")
        }
        this.retnval=false;
      })
      return this.retnval
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.clear()

    }
    public get loggedIn(): boolean {  
        return (localStorage.getItem('currentUser') !== null);  
      }  
}
