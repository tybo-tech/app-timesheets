export interface UserProject {
  UserProjectId: string;
  UserId: string;
  ProjectId: string;
  DateAssigned: string;
  AssignedBy: string;
  Notes: string;
  Status: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
}
