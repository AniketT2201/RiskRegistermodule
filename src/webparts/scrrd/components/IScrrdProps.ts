// export interface IScrrdProps {
//   description: string;
//   isDarkTheme: boolean;
//   environmentMessage: string;
//   hasTeamsContext: boolean;
//   userDisplayName: string;
// }



import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IScrrdProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  currentSPContext: any;
  context?:any;
  id:number;
}