import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Email } from 'src/models/email.model';

import { EmailService } from 'src/services/communication';
import { ADMIN, COMPANY_ID, CUSTOMER, IMAGE_DONE, SYSTEM } from 'src/shared/constants';
import { IS_DELETED_FALSE, AWAITING_ACTIVATION } from 'src/shared/status.const';
import { Order, User, UserModel } from 'src/models';
import { environment } from 'src/environments/environment';
import { UxService } from 'src/services/ux.service';
import { ModalModel } from 'src/models/modal.model';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { AccountService, OrderService } from 'src/services';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  rForm: FormGroup;
  error: string;


  selectedSubjects: any[] = [];
  hidePassword = true;
  paymentTypes: any[] = [];
  paymentOption: string;
  showLoader: boolean;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go shopping!',
    routeTo: '',
    img: undefined
  };
  order: Order;
  model: any;
  user: any;
  navHistory: NavHistoryUX;

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private emailService: EmailService,
    private _location: Location,
    private orderService: OrderService,
    private uxService: UxService,


  ) { }

  ngOnInit() {
    this.order = this.orderService.currentOrderValue;

    this.rForm = this.fb.group({
      Email: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.email
      ])),
      Password: [null, Validators.required],
      PhoneNumber: [null, Validators.required],
      Name: [null, Validators.required],
      // CompanyName: [null, Validators.required],
      Surname: [''],
      AddressLineHome: [''],
      UserType: 'Nurse',
      CreateUserId: [SYSTEM],
      ModifyUserId: [SYSTEM],
      IsDeleted: [IS_DELETED_FALSE],
      StatusId: 1
    });
    this.uxService.uxNavHistoryObservable.subscribe(data => {
      this.navHistory = data;
    })
  }

  back() {
    if (this.navHistory && this.navHistory.BackToAfterLogin) {
      this.routeTo.navigate([this.navHistory.BackToAfterLogin]);
    } else {
      this.routeTo.navigate(['']);
    }
  }
  onSubmit(model: UserModel) {
    model.Roles = [];
    model.CompanyId = COMPANY_ID;
    model.Roles.push({ Name: CUSTOMER });
    this.showLoader = true;
    // (this.places)

    model.AddressLineHome = model.AddressLineHome || ''
    model.AddressUrlHome = model.AddressUrlHome || ''
    model.AddressLineWork = model.AddressLineWork || ''
    model.AddressUrlWork = model.AddressUrlWork || ''
    model.Dp =  environment.DF_USER_LOGO;

    this.accountService.register(model).subscribe(user => {

      if (user && user.UserType === CUSTOMER && this.navHistory && this.navHistory.BackToAfterLogin) {
        this.routeTo.navigate([this.navHistory.BackToAfterLogin]);
      }

      if (user && user.UserType === CUSTOMER) {
        this.accountService.updateUserState(user);

        if (this.order && this.order.CustomerId === 'checked') {
          this.order.CustomerId = user.UserId;
          this.order.Customer = user;
          this.orderService.updateOrderState(this.order);
          this.modalModel.routeTo = `shop/checkout`;
          this.modalModel.ctaLabel = `Go to checkout`;
        } else {
          this.modalModel.routeTo = ``;
        }
        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE
        this.modalModel.ctaLabel = `Go to shopping`;
      }
      // send email logic here.
      if (user.Email) {
        this.sendEmail(user);
      } else {
        alert(user);
        this.showLoader = false;
        return;
      }
    });
  }




  sendEmail(data: UserModel | User) {
    const emailToSend: Email = {
      Email: data.Email,
      Subject: 'Welcome to  Tybo Marketplace.',
      Message: '',
      Link: this.accountService.generateAccountActivationReturnLink(data.UserToken)
    };
    this.showLoader = true;
    this.emailService.sendAccountActivationEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {
          setTimeout(() => {
            this.showLoader = false;
            this.modalModel.heading = `Success!`
            this.modalModel.img = IMAGE_DONE;
            this.modalModel.body.push('Account Registered successfully.')
            this.modalModel.body.push('PLEASE Check your email for activation.')
          }, 1000);
        }
      });
  }

}
