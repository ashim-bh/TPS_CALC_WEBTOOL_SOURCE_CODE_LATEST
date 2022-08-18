import { Ex5CompressorDetailUIModel } from "./Ex5CompressorDetailUIModel";
import { loadFilesModelDataEx5 } from "./loadFilesModelEx5";


export interface Ex5JobRecordUIModel {
   
    
    jobid: number;
   
    recId: number, 
    owner: string;
    jobName: string;
    creationdate: number;
    location: string; 
    //tavg:number,
    tmin:number,
    tmax:number,   
    tavg:number,
    staus?: number;
    exCompressorDetails?: Ex5CompressorDetailUIModel[];
    exFilePathData?: loadFilesModelDataEx5[];
    botStatus:string,
    userStatus:boolean;
    toolId: number;
    saveMethod: number;
}
export enum BOT_STATUS {
    NEW = 1,
    SUCCESS=2,
    RUNNING=3,
    FAILED=4,
    STOPPED=5
}