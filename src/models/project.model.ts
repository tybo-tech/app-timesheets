import { Timesheet } from "./timesheet.model";
import { UserProject } from "./userproject.model";

export interface Project {
  ProjectId: string;
  CompanyId: string;
  OrganizationId: string;
  OrganizationName: string;
  ApproverEmail: string;
  ProjectName: string;
  TimesheetWeek: string;
  StartDate: string;
  FinishDate: string;
  NursesNeeded: string;
  CareNeeded: string;
  BreakTime: string;
  TotalTime: string;
  Status: string;
  Members?:string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId:number
  PinCode:string
  UserProjects?:UserProject[];
  Timesheets?:Timesheet[];
}
