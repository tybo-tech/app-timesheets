import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './account/sign-in';
import { SignUpComponent } from './account/sign-up';
import { AddCustomerComponent } from './customer-feedback/customers/add-customer/add-customer.component';
import { CustomersComponent } from './customer-feedback/customers/customers/customers.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { CompanyProfileComponent } from './dashboard/company-profile/company-profile.component';
import { MyTimeComponent } from './dashboard/my-time/my-time.component';
import { ViewTimesheetComponent } from './dashboard/my-time/view-timesheet/view-timesheet.component';
import { AboutComponent } from './home/about/about.component';
import { HomeComponent } from './home/home.component';
import { AddServiceComponent } from './home/request-service/list-requests/add-service/add-service.component';
import { ListRequestFornurseComponent } from './home/request-service/list-requests/list-request-fornurse/list-request-fornurse.component';
import { ListRequestsComponent } from './home/request-service/list-requests/list-requests.component';
import { RequestServiceComponent } from './home/request-service/request-service.component';


const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'home/sign-up', component: SignUpComponent},
  {path:'home/about', component: AboutComponent},
  {path:'home/contact', component: SignUpComponent},
  {path:'home/sign-in', component: SignInComponent},
  {path:'private/my-time/:id', component: MyTimeComponent},
  {path:'private/admin-dashboard', component: AdminDashboardComponent},
  {path:'private/company-profile', component: CompanyProfileComponent},
  {path:'private/company-profile', component: ListRequestsComponent},
  {path:'private-link/list-request', component: ListRequestsComponent},
  {path:'private/see-slots', component: ListRequestFornurseComponent},
  {path:'private/nurses', component: CustomersComponent},
  {path:'home/request/:id', component: RequestServiceComponent},
  {path:'home/add-service/:id', component: AddServiceComponent},
  {path:'private/add-user/:id', component: AddCustomerComponent},
  {path:'private-link/view-timesheet/:id', component: ViewTimesheetComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
