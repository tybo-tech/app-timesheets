import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email, User } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { AccountService, EmailService, UploadService, UserService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { COMPANY_EMIAL, COMPANY_NAME, CUSTOMER, NURSE } from 'src/shared/constants';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  @Input() customerName: string;
  @Output() addingUserFinished: EventEmitter<Customer> = new EventEmitter();

  // <app-add-customer [user]="user">


  showLoader;


  emailToSend: Email;
  users: Customer[];
  user: User;
  customer: User;
  userId: string

  showGotoCustomer: boolean;
  existingCustomer: Customer;
  heading: string;
  constructor(
    private uploadService: UploadService,
    private userService: UserService,
    private accountService: AccountService,
    private uxService: UxService,
    private router: Router,
    private emailService: EmailService,
    private activatedRoute: ActivatedRoute,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.userId = r.id;
      this.user = this.accountService.currentUserValue;
      this.loadUser();
    });
  }

  ngOnInit() {
    this.userService.getUsersStync(this.user.CompanyId, NURSE).subscribe(data => {
      this.users = data || [];
    });
  }

  loadUser() {
    if (this.userId !== 'add') {
      this.heading = `${this.customer.Name} ${this.customer.Surname}`;
      this.userService.getUserSync(this.userId).subscribe(user => {
        this.customer = user;
      });
    } else {
      this.customer = {
        UserId: '',
        CompanyId: this.user.CompanyId,
        UserType: NURSE,
        Name: '',
        Surname: '',
        Email: '',
        PhoneNumber: '',
        Password: 'notset',
        Dp: '',
        AddressLineHome: '',
        AddressUrlHome: '',
        AddressLineWork: '',
        AddressUrlWork: '',
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: '1',
        UserToken: '',
        RatePH: '0'
      };
      this.heading = `Adding new nurse/carer`;
    }
  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.uploadService.resizeImage(file, null, this.customer);

    });
  }

  save() {
    if (this.customer.UserId && this.customer.UserId.length > 5) {
      this.userService.updateUserSync(this.customer).subscribe(data => {
        if (data && data.UserId) {
          // this.sendEmail(data, 'Update-Customer');
        }
      })
    }
    else {
      if (this.checkIfCustomerExist()) {
        this.uxService.updateMessagePopState('Customer already exist.');
        this.showGotoCustomer = true;
        return false
      }
      this.customer.Password = `${this.randomXToY(10000, 999999)}`
      this.userService.add(this.customer).subscribe(data => {
        if (data && data.UserId) {
          this.addingUserFinished.emit(data);
          this.sendEmail();
          this.uxService.updateMessagePopState('User created successfully')
        } else {
          alert(data);
        }
      });
    }


  }

  randomXToY(minVal, maxVal) {
    var randVal = minVal + (Math.random() * (maxVal - minVal));
    return Math.round(randVal);
  }

  sendEmail() {
    const emailToSend: Email = {
      From: 'accountns@tayihealthcare.com',
      Email: `${COMPANY_EMIAL} ,${this.customer.Email}`,
      Subject: 'Welcome to tayihealthcare',
      Message: `
      <h1> Welcome to tayihealthcare system</h1>
      <h3>
      Please login with this details: <br>

      Username:   ${this.customer.Email}<br>
      Password: ${this.customer.Password}<br>
      </h3>

      <a href="https://tayihealthcare.com/home/sign-in">Go to Login</a>

      
  <div style="text-align: left; padding: .1em;">
  <img src="https://tayihealthcare.com/assets/images/common/logo.png" style="width: 8em;" alt="">
</div>

      `,
      UserFullName: COMPANY_NAME
    };
    this.showLoader = true;
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        // this.router.navigate(['private/admin-dashboard']);
        // alert(`user added`)
        if (response > 0) {
          // this.sent = true;
          //Thank you for contacting us we will reply as soon as possible
        }
      });
  }




  getCustomerEmailType(type: string) {
    this.emailToSend = null;
    return this.emailToSend;
  }

  checkIfCustomerExist() {
    const customer = this.users && this.users.find(x => x.Email && x.Email.length > 4 && x.Email.includes('@') && x.Email === this.customer.Email);
    if (customer) {
      this.existingCustomer = customer;
    }
    return customer;
  }

}
