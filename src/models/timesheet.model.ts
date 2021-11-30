

export interface Timesheet {
  TimesheetId: string;
  CompanyId: string;
  OrganizationId: string;
  UserId: string;
  Name: string;
  TimesheetDate: string;
  TimesheetDay: string;
  TimesheetWeek: string;
  StartTime: string;
  FinishTime: string;
  BreakTime: string;
  TotalTime: string;
  Status: string;
  Notes: string;
  ApprovalCode: any;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number
}


export const weekDaysTimeSheet: Timesheet[] = [
  {
    TimesheetId: '',
    CompanyId: '',
    OrganizationId: '',
    UserId: '', Name: '',
    TimesheetDate: '',
    TimesheetDay: 'Monday',
    TimesheetWeek: '',
    StartTime: '',
    FinishTime: '',
    BreakTime: '0',
    TotalTime: '0',
    Status: 'Not sent for approval',
    Notes: '',
    ApprovalCode: '',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  },
  {
    TimesheetId: '',
    CompanyId: '',
    OrganizationId: '',
    UserId: '', Name: '',
    TimesheetDate: '',
    TimesheetDay: 'Tuesday',
    TimesheetWeek: '',
    StartTime: '',
    FinishTime: '',
    BreakTime: '0',
    TotalTime: '0',
    Status: 'Not sent for approval',
    Notes: '',
    ApprovalCode: '',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  },
  {
    TimesheetId: '',
    CompanyId: '',
    OrganizationId: '',
    UserId: '', Name: '',
    TimesheetDate: '',
    TimesheetDay: 'Wednesday',
    TimesheetWeek: '',
    StartTime: '',
    FinishTime: '',
    BreakTime: '0',
    TotalTime: '0',
    Status: 'Not sent for approval',
    Notes: '',
    ApprovalCode: '',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  },
  {
    TimesheetId: '',
    CompanyId: '',
    OrganizationId: '',
    UserId: '', Name: '',
    TimesheetDate: '',
    TimesheetDay: 'Thursday',
    TimesheetWeek: '',
    StartTime: '',
    FinishTime: '',
    BreakTime: '0',
    TotalTime: '0',
    Status: 'Not sent for approval',
    Notes: '',
    ApprovalCode: '',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  },
  {
    TimesheetId: '',
    CompanyId: '',
    OrganizationId: '',
    UserId: '', Name: '',
    TimesheetDate: '',
    TimesheetDay: 'Friday',
    TimesheetWeek: '',
    StartTime: '',
    FinishTime: '',
    BreakTime: '0',
    TotalTime: '0',
    Status: 'Not sent for approval',
    Notes: '',
    ApprovalCode: '',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  },
  {
    TimesheetId: '',
    CompanyId: '',
    OrganizationId: '',
    UserId: '', Name: '',
    TimesheetDate: '',
    TimesheetDay: 'Saturday',
    TimesheetWeek: '',
    StartTime: '',
    FinishTime: '',
    BreakTime: '0',
    TotalTime: '0',
    Status: 'Not sent for approval',
    Notes: '',
    ApprovalCode: '',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  },
  {
    TimesheetId: '',
    CompanyId: '',
    OrganizationId: '',
    UserId: '', Name: '',
    TimesheetDate: '',
    TimesheetDay: 'Sunday',
    TimesheetWeek: '',
    StartTime: '',
    FinishTime: '',
    BreakTime: '0',
    TotalTime: '0',
    Status: 'Not sent for approval',
    Notes: '',
    ApprovalCode: '',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  }
];