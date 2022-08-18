import { Component, ViewChild, HostListener, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';


import { UtilityService } from '@core/services/utility.service';
import { VersionUIModel } from '@core/models/versionUIModel';
import { HelpComponent, tpsHelpData } from '../shared/help/help.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@env/environment';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BOtStatus } from '@core/models/botStstusModel';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'tps-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  toolType = 'Calc55';
  opened = true;
  versionDetail: VersionUIModel;
  botStatus: BOtStatus;
  private dataSubList: Subscription[] = [];
  userName :string ;
  sub: any;

  botValStatNew = false;
  botValStatRun = false;
  botValStatSuccess = false;
  botValStatFailed = false;
  botValStatStopped = false;
  botVal: string;
  classBotVal: any;
  ex5Enabled: boolean;
  calc55Enabled: boolean;
  currentUrl: any;
  previousUrl: any;
  rtrUrl: any;
  rtrVal: any;
  loggedStat:boolean;

  constructor(private authenticationService:AuthenticationService,private utilityService: UtilityService, public dialog: MatDialog,private title:Title, private router: Router,private route: ActivatedRoute) { }

  ngOnInit() {


    this.utilityService.getUsername$.subscribe(data => {
      if (data) 
      {
        this.userName = data;
      }
     
    })
    if(!this.userName)
    {
      this.userName=JSON.parse(localStorage.getItem("username"));
      this.utilityService.setUsername(this.userName);
    
    }
    // this.userName="Ashim"
    // this.utilityService.setUsername(this.userName);
    this.rtrVal="";
    this.ex5Enabled=false;
    this.calc55Enabled=false;
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
      // //console.log("prev-path-header",this.previousUrl);
      
      if(this.currentUrl=='/calc55/new' || this.currentUrl.includes("/calc55/job/"))
      {
        this.rtrVal="tps-menu-link1";
      }
      if(this.currentUrl=='/calc55')
      {
        this.rtrVal="tps-menu-link";
      }
      if(this.currentUrl=='/ex5/new' || this.currentUrl.includes("/ex5/job/"))
      {
        this.rtrVal="tps-menu-link1";
      }
      if(this.currentUrl=='/ex5')
      {
        this.rtrVal="tps-menu-link";
      }
      ////console.log("splited--->",this.currentUrl.split['/']);
      if(this.currentUrl=='/' || this.currentUrl=='/login'|| this.currentUrl=='/reg')
      {
        this.ex5Enabled=false;
      this.calc55Enabled=false;
      }

      if(this.currentUrl=='/calc55'  ||  this.currentUrl=='/calc55/new' || this.currentUrl.includes("/calc55/job/")){

         this.toolType = 'Calc55';
      this.title.setTitle("TPS CALC-CALC55");
      this.ex5Enabled=false;
      this.calc55Enabled=true;
  // ex5 checking
      }
      else if(this.currentUrl.toString()=="/ex5" ||this.currentUrl.toString()=="/ex5/new" || this.currentUrl.includes("/ex5/job/")){
  
        this.toolType = 'Ex5';
      this.title.setTitle("TPS CALC-EX5");
      this.ex5Enabled=true;
      this.calc55Enabled=false;
    }
    });
    
    this.botValStatNew = false;
    this.botValStatRun = false;
    this.botValStatSuccess = false;
    this.botValStatFailed = false;
    this.botValStatStopped = false;

    const subsciption = this.utilityService.version$.subscribe(data => {
      if (data) this.versionDetail = data;
    })
    const sub = this.utilityService.botstat$.subscribe(data => {
      if (data)
        this.botStatus = data;
      if (this.botStatus.value1 == "New" ) {
        this.botValStatNew = true;
        this.botValStatRun = false;
        this.botValStatSuccess = false;
        this.botValStatFailed = false;
        this.botValStatStopped = false;
        this.classBotVal = "newClass";
      }
      if (this.botStatus.value1 == "Running") {
        this.botValStatRun = true;
        this.botValStatNew = false;
        this.botValStatSuccess = false;
        this.botValStatFailed = false;
        this.botValStatStopped = false;
        this.classBotVal = "runClass";
      }
      if (this.botStatus.value1 == "Success") {
        this.botValStatSuccess = true;
        this.botValStatNew = false;
        this.botValStatRun = false;
        this.botValStatFailed = false;
        this.botValStatStopped = false;
        this.classBotVal = "successClass";
      }
      if (this.botStatus.value1 == "Failed") {
        this.botValStatSuccess = false;
        this.botValStatNew = false;
        this.botValStatRun = false;
        this.botValStatFailed = true;
        this.botValStatStopped = false;
        this.classBotVal = "failedClass";
      }
      if (this.botStatus.value1 == "Stopped") {
        this.botValStatSuccess = false;
        this.botValStatNew = false;
        this.botValStatRun = false;
        this.botValStatFailed = false;
        this.botValStatStopped = true;
        this.classBotVal = "stoppedClass";
      }

    })

    this.route.data.subscribe(data => {
      this.sub = data;
    })




  }

  ngOnDestroy(): void {

    this.botValStatNew = false;
    this.botValStatRun = false;
    this.botValStatSuccess = false;


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

  onHelpBtnClick(strDat: string) {
    //console.log(strDat)
    const dialogData: tpsHelpData = {
      modalTitle: 'Pre-requesties/Help',
      customTemplate: false,
      modalContent: strDat,
      primaryBtnText: 'ok',
    }
    const dialogRef = this.dialog.open(HelpComponent, { data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  onLogout()
  {
    this.authenticationService.logout();  
    this.utilityService.userLoggedStat(false);
localStorage.removeItem("username")
    this.router.navigate(['/login']);

  }

}
