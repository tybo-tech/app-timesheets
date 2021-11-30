import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/models/customer.model';
import { UserService } from 'src/services';
import { AccountService } from 'src/services/account.service';
import { CustomerService } from 'src/services/customer.service';
import { CUSTOMER, NURSE } from 'src/shared/constants';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  showModal: boolean;
  showAddCustomer: boolean;
  showLoader: boolean;
  users: Customer[] = [];
  modalHeading = 'Add customer';
  user;
  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
   
    this.userService.getUsersStync(this.user.CompanyId, NURSE).subscribe(data=>{
      this.users =  data || [];
    });
  }
  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }
  view(user: Customer) {
    // this.customerService.updateCustomerState(user);
    this.router.navigate(['admin/dashboard/customer', user.CustomerId]);
  }
  add() {
    this.router.navigate(['private/add-user', 'add']);
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }

}
