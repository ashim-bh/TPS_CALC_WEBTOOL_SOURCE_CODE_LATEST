import { CompressorDetailUIModel } from "./CompressorDetailUIModel";
import { loadFilesModelData } from "./loadFilesModel";

export interface JobRecordUIModel {
    jobid: number;
    recId: number, 
    owner: string;
    jobName: string;
    creationdate: number;
    location: string;    
    staus?: number;
    compressorDetails?: CompressorDetailUIModel[];
    filePath?: loadFilesModelData[];
    //botStatus:BOT_STATUS[],
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