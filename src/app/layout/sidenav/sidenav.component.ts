import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalKeyComponent } from './modals/artist-key/modal-key.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: 'sidenav.component.html',
  styleUrls: ['sidenav.component.scss'],
})

export class SidenavComponent {

  dialogRefKey: MatDialogRef<ModalKeyComponent>;

  constructor(
    public auth: AuthService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  artistKeyVerification() {
    // alert(this.auth.user.roles.management);
    if (!this.auth.user.roles.management) {
      this.dialogRefKey = this.dialog.open(ModalKeyComponent);
      this.dialogRefKey.afterClosed().subscribe(data => {
        if (data !== '') {
          // this.sdacService.transferXsd(this.username, this.account.keys.active, data.transferto.toLowerCase(), data.amount, data.memo);
          this.auth.updateRole(data)
        }
      }
      )
    }
    else {
      // alert("nav goes here")
      this.router.navigateByUrl('/post-content');
    }


  }
}
