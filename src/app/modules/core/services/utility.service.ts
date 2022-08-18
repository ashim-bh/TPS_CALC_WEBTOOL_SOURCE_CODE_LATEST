import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { JobRecordUIModel } from '@core/models/JobRecordUIModel';
import { VersionUIModel } from '@core/models/versionUIModel';
import { environment } from '@env/environment';
import { BOtStatus } from '@core/models/botStstusModel';
import { Ex5JobRecordUIModel } from '@core/models/Ex5JobRecordUIModel';
import { AnyRecord } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
    
  private dataURL = 'http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/calc/get-jobs-data';
  private dataURLEX5='http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/Ex/get-jobs-data-Ex5'; 
  // `${environment.apiURL}/api/getJoblist
  // http://localhost:10000/api/getJobList
  
  version$  = new BehaviorSubject({
    enabled: false,
    value: null
  });
  botstat$  = new BehaviorSubject({
    enabled1: false,
    value1: null
 
  });
  loadFilesButton$:BehaviorSubject<boolean>=new BehaviorSubject <boolean>(false);
  loadFileStatus$:BehaviorSubject<boolean>=new BehaviorSubject <boolean>(false);
  loadFilesButtonEx5$:BehaviorSubject<boolean>=new BehaviorSubject <boolean>(false);
  revisionStatus$:BehaviorSubject<boolean>=new BehaviorSubject <boolean>(false);
  saveButtonStatus$:BehaviorSubject<boolean>=new BehaviorSubject <boolean>(false);
  runButtonStatus$:BehaviorSubject<boolean>=new BehaviorSubject <boolean>(false);
  getUsername$: BehaviorSubject<string>=new BehaviorSubject <string>("");

  getDetails$:BehaviorSubject <any[]>=new BehaviorSubject<any[]>(null);
  getPortionDetails$:BehaviorSubject <any[]>=new BehaviorSubject<any[]>(null);
  nonCurrentUser$:BehaviorSubject<boolean>=new BehaviorSubject <boolean>(true);
  loggedStat$:BehaviorSubject<boolean>=new BehaviorSubject <boolean>(true);
  getDetailsEx5$:BehaviorSubject <any[]>=new BehaviorSubject<any[]>(null);
  constructor(private http: HttpClient) { }

  public getJobList(): Observable<JobRecordUIModel[]> {
    return this.http.get<JobRecordUIModel[]>(this.dataURL);
  }
  public getJobListEx5(): Observable<Ex5JobRecordUIModel[]> {
    return this.http.get<Ex5JobRecordUIModel[]>(this.dataURLEX5);
  }
  public getJobListEdit(string1 : any): Observable<JobRecordUIModel> {
    return this.http.get<JobRecordUIModel>(string1);
  }
  public getJobListEditEX(string1 : any): Observable<Ex5JobRecordUIModel> {
    return this.http.get<Ex5JobRecordUIModel>(string1);
  }
  public saveCalcData(data : any): Observable<any> {
    return this.http.post('http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/calc/save-jobs-data',data);
     
  }
  public saveExData(data : any): Observable<any> {
    return this.http.post('http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/Ex/save-jobs-data',data);
     
  }
  
  public botStat(data : any): Observable<any> {
    return this.http.post(' http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/calc/update-bot-status',data);
     
  }
  public updateCalcData(data : any): Observable<any> {
    return this.http.put('http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/calc/update-job',data);
     
  }
  public updateExData(data : any): Observable<any> {
    return this.http.put('http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/Ex/update-job',data);
     
  }
  

  public registationAPI(data : any): Observable<any> {
    return this.http.post('http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/calc/user-register',data);
     
  }
  public loginAPI(data : any): Observable<any> {
    return this.http.post('http://ld6avdtpsnx02:8081/calc55upgarde-0.0.1-SNAPSHOT/api/v1/calc/user-login',data);
     
  }
  
  


  // Update Job Version
  updateVersionDetails(newValue: VersionUIModel) {
    this.version$.next(newValue)
  }
  updateBotStatus(newValue: BOtStatus) {
    this.botstat$.next(newValue)
  }
  setRevisionButton(status:boolean){
    this.revisionStatus$.next(status);
  }

  setSaveButton(status: boolean){
    this.saveButtonStatus$.next(status)
  }
  setRunButton(status: boolean){
    this.runButtonStatus$.next(status)
  }


  setUsername(name:string)
  {
    this.getUsername$.next(name)
  }

  setLoadFilesButton(status:boolean){
    this.loadFilesButton$.next(status);
  }

  setLoadStstus(status:boolean){
this.loadFileStatus$.next(status);
  }
  


  getLoadFilesData(data){
    this.getDetails$.next(data);

  }
  getLoadFilesPortionData(data){
    this.getPortionDetails$.next(data);
  }
  getLoadFilesEx5Data(data){
    this.getDetailsEx5$.next(data);
  }
  setUserStatus(status:boolean){
    this.nonCurrentUser$.next(status);
  }

  userLoggedStat(status:boolean){
    this.loggedStat$.next(status);
  }
}


