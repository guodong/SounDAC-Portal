import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'modal-redeem',
  templateUrl: './modal-redeem.component.html',
})
export class ModalRedeemComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalRedeemComponent>
  ) {}

  inputAmount = '';

  save() {
      this.dialogRef.close(this.inputAmount);
  }
  
  close() {
    this.dialogRef.close();
  }
}
