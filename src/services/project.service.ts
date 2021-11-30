import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Project } from 'src/models/project.model';
import { UserProject } from 'src/models/userproject.model';



@Injectable({
  providedIn: 'root'
})
export class ProjectService {



  private ProjectListBehaviorSubject: BehaviorSubject<Project[]>;
  public ProjectListObservable: Observable<Project[]>;

  private ProjectBehaviorSubject: BehaviorSubject<Project>;
  public ProjectObservable: Observable<Project>;
  url: string;
  printUrl = 'docs/48f1/project.php';


  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.ProjectListBehaviorSubject = new BehaviorSubject<Project[]>(JSON.parse(localStorage.getItem('ProjectsList')) || []);
    this.ProjectBehaviorSubject = new BehaviorSubject<Project>(JSON.parse(localStorage.getItem('currentProject')) || null);
    this.ProjectListObservable = this.ProjectListBehaviorSubject.asObservable();
    this.ProjectObservable = this.ProjectBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentProjectValue(): Project {
    return this.ProjectBehaviorSubject.value;
  }

  updateProjectListState(Projects: Project[]) {
    this.ProjectListBehaviorSubject.next(Projects);
    localStorage.setItem('ProjectsList', JSON.stringify(Projects));
  }
  updateProjectState(Project: Project) {
    this.ProjectBehaviorSubject.next(Project);
    localStorage.setItem('currentProject', JSON.stringify(Project));
  }
  add(Project: Project) {
    return this.http.post<Project>(`${this.url}/api/project/add-project.php`, Project);
  }
  addUserProject(userProject: UserProject) {
    return this.http.post<UserProject>(`${this.url}/api/project/add-user-project.php`, userProject);
  }
  update(Project: Project) {
    return this.http.post<Project>(`${this.url}/api/project/update-project.php`, Project);
  }
  getProjects(companyId: string) {
    this.http.get<Project[]>(`${this.url}/api/project/get-projects.php?CompanyId=${companyId}`).subscribe(data => {
      this.updateProjectListState(data || []);
    });
  }
  getProjectsByCompanySync(companyId: string) {
    return this.http.get<Project[]>(`${this.url}/api/project/get-by-company.php?CompanyId=${companyId}`);
  }
  getProjectsByUserId(userId: string) {
    return this.http.get<Project[]>(`${this.url}/api/project/get-by-userid.php?UserId=${userId}`)
  }

  getProject(ProjectId: string) {
    this.http.get<Project>(`${this.url}/api/project/get-by-id.php?ProjectId=${ProjectId}`).subscribe(data => {
      if (data) {
        this.updateProjectState(data);
      }
    });
  }

  getProjectSync(ProjectId: string) {
    return this.http.get<Project>(`${this.url}/api/project/get-by-id.php?ProjectId=${ProjectId}`);
  }
  getProjectByUserIdAndProject(ProjectId: string, userId:string) {
    return this.http.get<Project>(
      `${this.url}/api/project/get-by-user-and-project.php?ProjectId=${ProjectId}&UserId=${userId}`);
  }
  getProjectWorksSync(ProjectId: string) {
    return this.http.get<Project>(`${this.url}/api/project/get-project-work.php?ProjectId=${ProjectId}`);
  }


}
