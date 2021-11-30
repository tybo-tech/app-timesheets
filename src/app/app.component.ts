import { Component } from '@angular/core';
import { User } from 'src/models';
import { LoaderUx } from 'src/models/UxModel.model';
import { AccountService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { ADMIN } from 'src/shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: User;
  ADMIN = ADMIN;
  message: string;
  loading: boolean
  loadingUx: LoaderUx;
  showFeeback:boolean;
  constructor(
    private accountService: AccountService,
    private UxService: UxService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.user.subscribe(user => {
      this.user = user;
    })
    this.UxService.uxMessagePopObservable.subscribe(data => {
      this.message = data;
      // const id = setTimeout(() => {
      //   this.message = null;
      // }, 3000);
    });
    this.UxService.uxLoadingPopObservable.subscribe(data => {

      const id = setTimeout(() => {
        this.loadingUx = data;
      }, 0);
    });
  }

}
