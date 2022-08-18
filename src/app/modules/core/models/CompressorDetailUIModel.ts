export interface CompressorDetailUIModel {
  
  compId: number;  
  name: string;
  checkedStatus: boolean,
  portionEnabled:boolean;
  portion? : Portion[];
  compType: string;
  productStructre:boolean,
  position: string;
  outlet: string;
  collector: boolean;
  startAngle: string;
  value: number;
  enabled:boolean;
  thetaEnabled:boolean;
}

export interface Portion {
  portionId: number,
  name: string,
  filePath: string,
  checked: boolean;
}
