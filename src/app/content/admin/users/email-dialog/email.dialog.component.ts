import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../../models/user';

@Component({
  selector: 'email-dialog',
  templateUrl: './email.dialog.component.html',
  styleUrls: ['./email.dialog.component.scss']
})
export class AdminUserEmailDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AdminUserEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) { }

}
