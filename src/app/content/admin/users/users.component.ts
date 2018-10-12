// Core
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminUserService } from '../../../services/admin-user.service';
import { UIService } from '../../../services/ui.service';
import { AdminUserEmailDialogComponent } from './email-dialog/email.dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../../models/user';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'admin-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class AdminUsersComponent implements OnInit, OnDestroy {

  constructor(
    private adminUserService: AdminUserService,
    public dialog: MatDialog,
    private ui: UIService,
  ) {
  }

  private subscription: Subscription;
  displayedColumns: string[] = ['createdAt', 'id', 'username', 'email', 'roles', 'actions'];
  dataSource: User[];
  username: string;
  email: string;
  startDateVal: Date;
  endDateVal: Date;

  ngOnInit() {
    // this.getUsers();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getUsers() {
    // this.ui.showLoading();
    // this.subscription = this.adminUserService.getUsers().subscribe(users => {
    //   this.dataSource = users;
    //   // this.ui.hideLoading();
    // });
  }

  getByUsername(username) {
    this.ui.showLoading();
    this.unsubscribe();
    this.subscription = this.adminUserService.getUsersByUsername(username).subscribe(users => {
      this.dataSource = users;
      this.ui.hideLoading();
    });
  }

  getByEmail(email) {
    this.ui.showLoading();
    this.unsubscribe();
    this.subscription = this.adminUserService.getUsersByEmail(email).subscribe(users => {
      this.dataSource = users;
      this.ui.hideLoading();
    });
  }

  getByDate(startDate, endDate) {
    this.ui.showLoading();
    this.unsubscribe();
    this.subscription = this.adminUserService.getUsersByDate(startDate, endDate).subscribe(users => {
      this.dataSource = users;
      this.ui.hideLoading();
    });
  }

  toggleManagement(user: User) {
    this.ui.showLoading();
    user.roles.management = !user.roles.management;
    this.adminUserService.updateUser(user).then(result => {
      this.ui.hideLoading();
    });
  }

  toggleAdmin(user: User) {
    this.ui.showLoading();
    user.roles.admin = !user.roles.admin;
    this.adminUserService.updateUser(user).then(result => {
      this.ui.hideLoading();
    });
  }

  // It is currently not possible to update a firebase Auth email account without being logged on it
  // This method will require a custom login on the User (Possible but require more time)
  // updateEmail(user: User) {

  //   const dialogRef = this.dialog.open(AdminUserEmailDialogComponent, {
  //     width: 'auto',
  //     data: user
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.ui.showLoading();
  //       user.email = result;
  //       this.adminUserService.updateUser(user).then(res => {
  //         this.ui.hideLoading();
  //       });
  //     }
  //   });

  // }

}
