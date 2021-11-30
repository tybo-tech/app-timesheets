import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Project } from 'src/models/project.model';
import { Timesheet } from 'src/models/timesheet.model';
import { AccountService } from 'src/services';
import { ProjectService } from 'src/services/project.service';
import { TimesheetService } from 'src/services/timesheet.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-list-request-fornurse',
  templateUrl: './list-request-fornurse.component.html',
  styleUrls: ['./list-request-fornurse.component.scss']
})
export class ListRequestFornurseComponent implements OnInit {
  projects: Project[];
  project: Project;
  user: User;
  search;
  daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  weekDaysTimeSheet: Timesheet[];
  constructor(
    private projectService: ProjectService,
    private accountService: AccountService,
    private timesheetService: TimesheetService,
    private uxService: UxService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.user) {
      this.loadProjects()
    }
  }

  loadProjects() {
    this.projectService.getProjectsByCompanySync(this.user.CompanyId).subscribe(data => {
      if (data && data.length) {
        this.projects = data;
      } else {
        this.projects = [];
      }
    });
  }

  add() {
    this.router.navigate(['home/add-service/add'])
  }

  createTimeSheet(project: Project) {
    if (project && project.ProjectId) {
      let firstDate = new Date(project.StartDate);
      let endDate = new Date(project.FinishDate);
      this.weekDaysTimeSheet = [];
      while (firstDate <= endDate) {
        this.weekDaysTimeSheet.push({
          TimesheetId: '',
          CompanyId: '',
          OrganizationId: project.ProjectId,
          UserId: '',
          Name: this.user.Name,
          TimesheetDate: `${firstDate}`,
          TimesheetDay: `${this.daysInWeek[firstDate.getDay()]}`,
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
        );
        firstDate.setDate(firstDate.getDate() + 1);

      }
      this.weekDaysTimeSheet.map(x => {
        x.CompanyId = this.user.CompanyId;
        x.UserId = this.user.UserId;
        x.CreateUserId = this.user.UserId;
        x.ModifyUserId = this.user.UserId;
        x.TimesheetWeek = project.TimesheetWeek;
        x.TimesheetDate = this.formatDate(x.TimesheetDate);
        return x;
      });
      // this.loadTime();

    }
  }
  join(project: Project) {

    if (project) {
      this.createTimeSheet(project);

      if (project && confirm("Are sure you wanna join this job?")) {
        let mebers: any[] = [];
        if (project.Members && project.Members.length > 2) {
          mebers = JSON.parse(project.Members);
        }
        if (!mebers.find(x => x === this.user.Name)) {
          mebers.push(this.user.Name);
        }
        project.Members = JSON.stringify(mebers);

        this.projectService.update(project).subscribe(data => {
          if (data && data.ProjectId) {
            this.timesheetService.addRange(this.weekDaysTimeSheet).subscribe(res => {
              this.loadProjects();
              this.uxService.updateMessagePopState('You have joined ' + project.OrganizationName + ' project successfully');
            });
          }
        })

        project.Members = this.user.Name;
      }

    }
  }

  userJoined(project: Project) {
    let mebers: any[] = [];
    if (project.Members && project.Members.length > 2) {
      mebers = JSON.parse(project.Members);
    }
    return mebers.find(x => x === this.user.Name);
  }

  gototime(project: Project) {
    this.router.navigate(['private/my-time', project.ProjectId]);

  }

  logout() {
    this.accountService.updateUserState(null);
    this.router.navigate(['']);
  }


  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
