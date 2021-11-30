import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User, DEF_USER, Email } from 'src/models';
import { Project } from 'src/models/project.model';
import { EmailService, AccountService } from 'src/services';
import { ProjectService } from 'src/services/project.service';
import { COMPANY_ID, COMPANY_EMIAL, COMPANY_NAME } from 'src/shared/constants';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
  step = 1;

  showLoader;
  sent: boolean;
  requestId: any;
  heading: string;
  user: User;
  project: Project;

  weekId = 'Week-19-april-23-april-2021';
  projects: Project[];

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  constructor(
    private emailService: EmailService,
    private acountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.requestId = r.id;
      this.heading = this.requestId === 'nurse' ? `Request for a Nurse` : `Request for a Carer`;
    });
  }

  ngOnInit() {
    this.user = this.acountService.currentUserValue;
    if (!this.user) {
      this.user = DEF_USER;
    }
    this.project = {
      ProjectId: '',
      CompanyId: COMPANY_ID,
      OrganizationId: '',
      OrganizationName: '',
      ApproverEmail: '',
      ProjectName: '',
      TimesheetWeek: '',
      StartDate: '0',
      FinishDate: '0',
      NursesNeeded: '1',
      CareNeeded: '1',
      BreakTime: '0',
      TotalTime: '0',
      Status: 'Active',
      PinCode: '0000',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    }
  }


  back() {
    this.router.navigate([`private/admin-dashboard`]);
  }

  sendEmail() {
    const emailToSend: Email = {
      From: this.project.ApproverEmail,
      Email: COMPANY_EMIAL,
      Subject: this.project.OrganizationName + ' : New request',
      Message: `${this.project.ProjectName}  <br>From:<b> ${this.project.StartDate} </b> 
      <br> To: <b>${this.project.FinishDate}</b> <br> 
      Nursers Needed: <b>${this.project.NursesNeeded}</b>
      Careres  Needed: <b>${this.project.CareNeeded}</b> <br>

      <h1> Please login to your dashbaord to view</h1>

      <a href="https://tayihealthcare.com/">Go to my dashboard</a>

      
  <div style="text-align: left; padding: .1em;">
  <img src="https://tayihealthcare.com/assets/images/common/logo.png" style="width: 8em;" alt="">
</div>

      `,
      UserFullName: COMPANY_NAME
    };
    this.showLoader = true;
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        this.project = null;

        if (response > 0) {
          this.project = null;

          // this.sent = true;
          //Thank you for contacting us we will reply as soon as possible
        }
      });
  }
  saveProject() {
    let weekId = '';
    if (this.project.StartDate && this.project.FinishDate) {
      weekId += `Week-${new Date(this.project.StartDate).getDate()}-${this.months[new Date(this.project.StartDate).getMonth()]}-${new Date(this.project.StartDate).getFullYear()}-to-`
      weekId += `${new Date(this.project.FinishDate).getDate()}-${this.months[new Date(this.project.FinishDate).getMonth()]}-${new Date(this.project.FinishDate).getFullYear()}`
      this.project.StartDate = `${new Date(this.project.StartDate)}`;
      this.project.FinishDate = `${new Date(this.project.FinishDate)}`;

    } else {
      alert('Dates are needed');
      return;
    }

    this.project.TimesheetWeek = weekId;
    this.project.ProjectName = this.project.ProjectName || 'No Notes';
    this.projectService.add(this.project).subscribe(data => {
      if (data && data.ProjectId) {
        this.sendEmail();
        this.sent = true;

        // this.loadProjects();
      }
    });

  }



}
