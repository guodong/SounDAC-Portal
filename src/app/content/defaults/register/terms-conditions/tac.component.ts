// Core
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Utilities
import { AlertBtnText } from '../../../../modules/shared/utilities/enums';

@Component({
  selector: 'tac',
  templateUrl: './tac.component.html',
  styleUrls: ['./tac.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TacComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TacComponent>
  ) { }


  close() {
    this.dialogRef.close();
  }

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
      case AlertBtnText.Close:
        this.dialogRef.close();
        break;
      default:
        this.dialogRef.close();
    }
  }
}
