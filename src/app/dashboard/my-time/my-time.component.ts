import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email, User } from 'src/models';
import { Project } from 'src/models/project.model';
import { Timesheet, weekDaysTimeSheet } from 'src/models/timesheet.model';
import { AccountService, EmailService } from 'src/services';
import { ProjectService } from 'src/services/project.service';
import { TimesheetService } from 'src/services/timesheet.service';
import { UxService } from 'src/services/ux.service';
import { NOTIFY_EMAILS } from 'src/shared/constants';

@Component({
  selector: 'app-my-time',
  templateUrl: './my-time.component.html',
  styleUrls: ['./my-time.component.scss']
})
export class MyTimeComponent implements OnInit {
  user: User;
  // weekDaysTimeSheet: Timesheet[] = weekDaysTimeSheet;
  weekDaysTimeSheet: Timesheet[] = [];
  timesheet: Timesheet;
  totalTime = 0;
  totalBreak = 0;
  weekId = 'Week-19-april-23-april-2021';
  userWeeklyTimes: Timesheet[];
  projects: Project[];
  project: Project;
  organizationName: string;
  showChangeWeek: boolean;
  overAllStatus: string = 'Not captured yet';
  reason;
  allTimes: Timesheet[];
  daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  projectId: any;

  constructor(
    private timesheetService: TimesheetService,
    private accountService: AccountService,
    private router: Router,
    private uxService: UxService,
    private projectService: ProjectService,
    private emailService: EmailService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.router.navigate([''])
    }

    this.activatedRoute.params.subscribe(r => {
      this.projectId = r.id;
      this.getProject(this.projectId);
    });
  }

  ngOnInit() {


    // this.loadProjects();
  }
  getProject(id) {
    this.totalTime = 0;
    this.totalBreak = 0;
    this.projectService.getProjectByUserIdAndProject(id, this.user.UserId).subscribe(data => {
      if (data && data.ProjectId) {
        this.project = data;
        this.project.Timesheets.forEach(x => {

          this.totalTime += Number(x.TotalTime);
          this.totalBreak += Number(x.BreakTime);
        });
        this.overAllStatus = this.project?.Timesheets[0]?.Status;
        this.reason = this.project?.Timesheets[0]?.Notes;
      }
    })
  }
  timeDiff(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    if (hours < 0)
      hours = hours + 24;

    return hours + (minutes / 60)

    // return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
  }
  send() {
    if (confirm(`Are your sure you have captured your hours correctly?
     Press ok if you want to send your timesheet for approval.`)) {
      const code = this.randomXToY(1000, 9999);
      this.project.Timesheets.map(x => x.Status = 'Sent for approval');
      this.timesheetService.updateRange( this.project.Timesheets).subscribe(data => {
        console.log(data);
        const body = `Timesheet has been Submitted by ${this.user.Name}, : (Approval code ${code}).`;
        this.sendEmailLogToShop(body, '', this.project.ApproverEmail);
        this.sendEmailLogToShop(body, '', NOTIFY_EMAILS);
        this.getProject(this.projectId)
        this.uxService.updateMessagePopState('Timesheet has been Submitted.')
      })

    }
  }
  saveTime() {
    this.timesheet.TimesheetDate = this.formatDate(this.timesheet.TimesheetDate);
    this.timesheet.TotalTime = `${this.timeDiff(this.timesheet.StartTime, this.timesheet.FinishTime) - Number(this.timesheet.BreakTime)}`;
    // alert(  this.timesheet.TotalTime);

    this.timesheetService.updateRange([this.timesheet]).subscribe(data => {
      if (data && data.TimesheetId) {
        this.timesheet = null;
        this.getProject(this.projectId);
        this.uxService.updateMessagePopState('Timesheet updated successfully')
      }
    });

  }

  randomXToY(minVal, maxVal) {
    var randVal = minVal + (Math.random() * (maxVal - minVal));
    return Math.round(randVal);
  }
  loadTime() {
    this.totalTime = 0
    this.totalBreak = 0;
    this.timesheetService.getTimesheetsByUserId(this.user.UserId).subscribe(data => {
      this.uxService.hideLoader();
      if (data && data.length) {
        this.allTimes = data;
        this.userWeeklyTimes = data.filter(x => x.TimesheetWeek === this.weekId);
        this.weekDaysTimeSheet.forEach(week => {
          const existingWeek = this.userWeeklyTimes.find(x => x.TimesheetWeek === this.weekId && x.TimesheetDay === week.TimesheetDay)
          if (existingWeek) {
            week.TotalTime = existingWeek.TotalTime;
            week.BreakTime = existingWeek.BreakTime;
            week.StartTime = existingWeek.StartTime;
            week.FinishTime = existingWeek.FinishTime;
          }
          this.totalTime += Number(week.TotalTime);
          this.totalBreak += Number(week.BreakTime);
        });
        this.overAllStatus = this.userWeeklyTimes[0].Status;
        this.reason = this.userWeeklyTimes[0].Notes;

      } else {
        this.userWeeklyTimes = [];
      }
    });
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



  print() {
    this.uxService.updateMessagePopState('Invoice downloading ...');
    const url = this.timesheetService.getInvoiceURL(this.project.ProjectId, this.user.UserId);
    const win = window.open(url, '_blank');
    win.focus();
  }
  goto(url: string) {
    this.router.navigate([url]);
  }





  selecProject(project: Project) {
    this.project = project;
    this.weekId = project.TimesheetWeek;
    this.organizationName = project.OrganizationName;
    this.showChangeWeek = false;
    this.totalTime = 0
    this.totalBreak = 0;
    this.userWeeklyTimes = this.allTimes.filter(x => x.TimesheetWeek === this.weekId);
    this.weekDaysTimeSheet.map(x => {
      x.CompanyId = this.user.CompanyId;
      x.UserId = this.user.UserId;
      x.CreateUserId = this.user.UserId;
      x.ModifyUserId = this.user.UserId;
      x.TimesheetWeek = this.weekId;
      x.TotalTime = '0';
      x.BreakTime = '0';
      return x;
    });
    this.weekDaysTimeSheet.forEach(week => {
      const existingWeek = this.userWeeklyTimes.find(x => x.TimesheetWeek === this.weekId && x.TimesheetDay === week.TimesheetDay)
      if (existingWeek) {
        week.TotalTime = existingWeek.TotalTime;
        week.BreakTime = existingWeek.BreakTime;
        this.totalTime += Number(week.TotalTime);
        this.totalBreak += Number(week.BreakTime);
      }

    });
  }

  sendEmailLogToShop(data, companyName: string, email: string) {
    const emailToSend: Email = {
      Email: email,
      Subject: 'Weekly timesheet approval request.',
      Message: `${data}`,
      UserFullName: companyName,
      Link: `${environment.BASE_URL}/private-link/view-timesheet/${this.user.UserId}@${this.project.ProjectId}`,
      LinkLabel: 'View timesheet'
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }

  back() {
    this.router.navigate(['private/see-slots'])
  }
}
