import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email } from 'src/models';
import { Project } from 'src/models/project.model';
import { Timesheet } from 'src/models/timesheet.model';
import { EmailService } from 'src/services';
import { ProjectService } from 'src/services/project.service';
import { TimesheetService } from 'src/services/timesheet.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-view-timesheet',
  templateUrl: './view-timesheet.component.html',
  styleUrls: ['./view-timesheet.component.scss']
})
export class ViewTimesheetComponent implements OnInit {
  userId: string;
  projectId: string;
  times: Timesheet[];
  totalTime: number;
  totalBreak: number;
  user: any;
  userWeeklyTimes: Timesheet[];
  overAllStatus: any;
  showNotes: boolean;
  reasons: string;
  project: Project;
  reason: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private timesheetService: TimesheetService,
    private uxService: UxService,
    private emailService: EmailService,
    private projectService: ProjectService,
  ) {
    this.activatedRoute.params.subscribe(r => {
      const id: string = r.id;
      if (id && id.split('@').length === 2) {
        this.userId = id.split('@')[0];
        this.projectId = id.split('@')[1];
        this.getProject();
      }
    });
  }

  ngOnInit() {
    // this.timesheetService.getTimesheetsByUserId(this.userId).subscribe(data => {
    //   if (data && data.length) {
    //     this.times = data.filter(x => x.TimesheetWeek === this.weekId);
    //   }
    // })
  }
  getProject() {
    this.totalTime = 0;
    this.totalBreak = 0;
    this.projectService.getProjectByUserIdAndProject(this.projectId, this.userId).subscribe(data => {
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
  print() {
    const url = this.timesheetService.getInvoiceURL(this.projectId, this.userId);
    const win = window.open(url, '_blank');
    win.focus();
  }
  approve() {
    if (confirm(`Are your sure you want to approve.`)) {
      this.project.Timesheets.map(x => x.Status = 'Approved');
      this.timesheetService.updateRange(this.project.Timesheets).subscribe(data => {
        console.log(data);
        //  this.loadProjects();
        const body = `Timesheet has been approved`;
        //  this.sendEmailLogToShop(body, '', this.project.ApproverEmail);
        this.uxService.updateMessagePopState(body);
        this.getProject();
      })

    }
  }
  notes() {
    this.showNotes = true;
  }
  decline() {
    if (confirm(`Are your sure you want to decline.`)) {
      this.project.Timesheets.map(x => x.Status = 'Declined');
      this.project.Timesheets.map(x => x.Notes = this.reasons);
      this.timesheetService.updateRange(this.project.Timesheets).subscribe(data => {
        console.log(data);
        //  this.loadProjects();
        const body = `Timesheet has been approved, thank you you can close this window now.`;
        this.getProject();
        //  this.sendEmailLogToShop(body, '', this.project.ApproverEmail);
        this.uxService.updateMessagePopState(`Timesheet has been declined, thank you you can close this window now.`)
      })

    }
  }


  sendEmailLogToShop(data, companyName: string, email: string) {
    const emailToSend: Email = {
      Email: email,
      Subject: 'Weekly timesheet approval request.',
      Message: `${data}`,
      UserFullName: companyName,
      Link: `${environment.BASE_URL}/private-link/view-timesheet/${this.user.UserId}@${this.projectId}`,
      LinkLabel: 'View timesheet'
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }

  loadTime() {
    this.totalTime = 0
    this.totalBreak = 0;
    this.timesheetService.getTimesheetsByUserId(this.userId).subscribe(data => {
      this.uxService.hideLoader();
      if (data && data.length) {
        this.userWeeklyTimes = data.filter(x => x.TimesheetWeek === this.projectId);

        this.userWeeklyTimes.forEach(week => {
          this.totalTime += Number(week.TotalTime);
          this.totalBreak += Number(week.BreakTime);
        });
        this.overAllStatus = this.userWeeklyTimes[0].Status;

      } else {
        this.userWeeklyTimes = [];
      }
    });
  }
}
