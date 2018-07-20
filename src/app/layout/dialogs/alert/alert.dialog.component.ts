import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertBtnText } from '../../../modules/shared/utilities/enums';

@Component({
  selector: 'alert',
  templateUrl: './alert.dialog.component.html'
})

export class AlertDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AlertDialogComponent>
  ) { }

  btnClick(btnText) {
    const that = this;
    switch (btnText) {
      case AlertBtnText.ResendEmail:
        break;
      case AlertBtnText.UpdateEmail:
        break;
      case AlertBtnText.OK:
        this.dialogRef.close();
        break;
      default:
        this.dialogRef.close();
    }
  }

}
