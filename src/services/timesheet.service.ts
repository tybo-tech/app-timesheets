import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Timesheet } from 'src/models/timesheet.model';



@Injectable({
  providedIn: 'root'
})
export class TimesheetService {



  private TimesheetListBehaviorSubject: BehaviorSubject<Timesheet[]>;
  public TimesheetListObservable: Observable<Timesheet[]>;

  private TimesheetBehaviorSubject: BehaviorSubject<Timesheet>;
  public TimesheetObservable: Observable<Timesheet>;
  url: string;
  printUrl = 'docs/48f1/timesheet.php';


  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.TimesheetListBehaviorSubject = new BehaviorSubject<Timesheet[]>(JSON.parse(localStorage.getItem('TimesheetsList')) || []);
    this.TimesheetBehaviorSubject = new BehaviorSubject<Timesheet>(JSON.parse(localStorage.getItem('currentTimesheet')) || null);
    this.TimesheetListObservable = this.TimesheetListBehaviorSubject.asObservable();
    this.TimesheetObservable = this.TimesheetBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentTimesheetValue(): Timesheet {
    return this.TimesheetBehaviorSubject.value;
  }

  updateTimesheetListState(Timesheets: Timesheet[]) {
    this.TimesheetListBehaviorSubject.next(Timesheets);
    localStorage.setItem('TimesheetsList', JSON.stringify(Timesheets));
  }
  updateTimesheetState(Timesheet: Timesheet) {
    this.TimesheetBehaviorSubject.next(Timesheet);
    localStorage.setItem('currentTimesheet', JSON.stringify(Timesheet));
  }
  add(Timesheet: Timesheet) {
    return this.http.post<Timesheet>(`${this.url}/api/timesheet/add-timesheet.php`, Timesheet);
  }
  update(Timesheet: Timesheet) {
    return this.http.post<Timesheet>(`${this.url}/api/timesheet/update-Timesheet.php`, Timesheet);
  }
  addRange(timesheets: Timesheet[]) {
    return this.http.post<Timesheet>(`${this.url}/api/timesheet/insert-timesheet-range.php`, timesheets);
  }
  updateRange(timesheets: Timesheet[]) {
    return this.http.post<Timesheet>(`${this.url}/api/timesheet/update-timesheet-range.php`, timesheets);
  }
  getTimesheets(companyId: string) {
    this.http.get<Timesheet[]>(`${this.url}/api/timesheet/get-Timesheets.php?CompanyId=${companyId}`).subscribe(data => {
      this.updateTimesheetListState(data || []);
    });
  }
  getTimesheetsByUserId(userId: string) {
    return this.http.get<Timesheet[]>(`${this.url}/api/timesheet/get-by-userid.php?UserId=${userId}`)
  }

  getTimesheet(TimesheetId: string) {
    this.http.get<Timesheet>(`${this.url}/api/timesheet/get-Timesheet.php?TimesheetId=${TimesheetId}`).subscribe(data => {
      if (data) {
        this.updateTimesheetState(data);
      }
    });
  }

  getTimesheetSync(TimesheetId: string) {
    return this.http.get<Timesheet>(`${this.url}/api/timesheet/get-Timesheet.php?TimesheetId=${TimesheetId}`);
  }
  getTimesheetWorksSync(TimesheetId: string) {
    return this.http.get<Timesheet>(`${this.url}/api/timesheet/get-Timesheet-work.php?TimesheetId=${TimesheetId}`);
  }

  
  getInvoiceURL(projectId: string, userId:string) {
    return `${this.url}/api/${this.printUrl}?ProjectId=${projectId}&userId=${userId}`;
  }

}
