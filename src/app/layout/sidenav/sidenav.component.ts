import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalKeyComponent } from './modals/artist-key/modal-key.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { User } from '../../models/user';
import { Router, RouterLink } from '@angular/router';

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

    const auth = this;

    if (!this.auth.user.roles.management) {
      this.dialogRefKey = this.dialog.open(ModalKeyComponent);
      this.dialogRefKey.afterClosed().subscribe(data => {
        if (data.key !== '') {
          this.auth.updateRole(data);
        }
      });
    }
    else {
      auth.router.navigateByUrl('/post-content'); 
    }
  }
}
