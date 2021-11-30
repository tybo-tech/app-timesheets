import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Project } from 'src/models/project.model';
import { Timesheet } from 'src/models/timesheet.model';
import { AccountService } from 'src/services';
import { ProjectService } from 'src/services/project.service';
import { TimesheetService } from 'src/services/timesheet.service';

@Component({
  selector: 'app-list-requests',
  templateUrl: './list-requests.component.html',
  styleUrls: ['./list-requests.component.scss']
})
export class ListRequestsComponent implements OnInit {
  projects: Project[];
  project: Project;
  user: User;
  search;
  constructor(
    private projectService: ProjectService,
    private accountService: AccountService,
    private timesheetService: TimesheetService,
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
  print(e:Timesheet){
    const url = this.timesheetService.getInvoiceURL(e.OrganizationId, e.UserId);
    const win = window.open(url, '_blank');
    win.focus();
  }
}
