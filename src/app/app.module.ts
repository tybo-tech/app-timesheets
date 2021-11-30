import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SignUpComponent } from './account/sign-up';
import { SignInComponent } from './account/sign-in';
import { CustomerFeedbackComponent } from './customer-feedback/customer-feedback.component';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MyTimeComponent } from './dashboard/my-time/my-time.component';
import { CompanyProfileComponent } from './dashboard/company-profile/company-profile.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViewTimesheetComponent } from './dashboard/my-time/view-timesheet/view-timesheet.component';
import { AddUserComponent } from './dashboard/admin-dashboard/add-user/add-user.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './home/about/about.component';
import { ContactComponent } from './home/contact/contact.component';
import { RequestServiceComponent } from './home/request-service/request-service.component';
import { ListRequestsComponent } from './home/request-service/list-requests/list-requests.component';
import { CustomersComponent } from './customer-feedback/customers/customers/customers.component';
import { AddCustomerComponent } from './customer-feedback/customers/add-customer/add-customer.component';
import { SearchByNamePipe } from 'src/shared/pipes/searchByName.pipe';
import { AddServiceComponent } from './home/request-service/list-requests/add-service/add-service.component';
import { SlidesComponent } from './home/slides/slides.component';
import { ListRequestFornurseComponent } from './home/request-service/list-requests/list-request-fornurse/list-request-fornurse.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    CustomerFeedbackComponent,
    MyTimeComponent,
    CompanyProfileComponent,
    AdminDashboardComponent,
    ViewTimesheetComponent,
    AddUserComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    RequestServiceComponent,
    ListRequestsComponent,
    CustomersComponent,
    AddCustomerComponent,
    SearchByNamePipe, AddServiceComponent, SlidesComponent,
    ListRequestFornurseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
