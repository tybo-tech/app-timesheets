import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Project } from 'src/models/project.model';
import { Timesheet, weekDaysTimeSheet } from 'src/models/timesheet.model';
import { AccountService } from 'src/services';
import { ProjectService } from 'src/services/project.service';
import { TimesheetService } from 'src/services/timesheet.service';
import { UxService } from 'src/services/ux.service';

type NewType = AccountService;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  user: User;
  project: Project;
  totalTime = 0;
  totalBreak = 0;
  weekId = 'Week-19-april-23-april-2021';
  projects: Project[];
  weekStart: string;
  weekEnd: string;
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  constructor(
    private projectService: ProjectService,
    private accountService: AccountService,
    private timesheetService: TimesheetService,
    private router: Router,
    private uxService: UxService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.router.navigate([''])
    }

    this.loadProjects();
  }
  send() { }

  loadProjects() {
    this.projectService.getProjectsByCompanySync(this.user.CompanyId).subscribe(data => {
      if (data && data.length) {
        this.projects = data;
      } else {
        this.projects = [];
      }
    });
  }

  print() {
    this.uxService.updateMessagePopState('Invoice downloading ...');
    const url = this.timesheetService.getInvoiceURL(this.weekId, this.user.UserId);
    const win = window.open(url, '_blank');
    win.focus();
  }
  goto(url: string) {
    this.router.navigate([url]);
  }

  logout() {
    this.accountService.updateUserState(null);
    this.router.navigate(['']);
  }
  add() {
    // this.project = {
    //   ProjectId: '',
    //   CompanyId: this.user.CompanyId,
    //   OrganizationId: '',
    //   OrganizationName: '',
    //   ApproverEmail: '',
    //   ProjectName: '',
    //   TimesheetWeek: '',
    //   StartTime: '0',
    //   FinishTime: '0',
    //   BreakTime: '0',
    //   TotalTime: '0',
    //   Status: 'Active',
    //   PinCode: '0000',
    //   CreateUserId: this.user.UserId,
    //   ModifyUserId: this.user.UserId,
    //   StatusId: 1
    // }
  }
}
