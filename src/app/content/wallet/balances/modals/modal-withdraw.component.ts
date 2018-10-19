import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'modal-withdraw',
  templateUrl: './modal-withdraw.component.html'
})

export class ModalWithdrawComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalWithdrawComponent>
  ) { }

  minVIP = this.data.balance - 5;
  inputAmount = '';
  getWeeklyAmount() {
    return ((Number.parseFloat(this.inputAmount) / 13) / Math.pow(10, 3)).toFixed(6);
  }

  save() {
    this.dialogRef.close(this.inputAmount);
  }

  close() {
    this.dialogRef.close();
  }

  min() {
    let val = false;
    if (Number.parseFloat(this.inputAmount) > this.minVIP) {
      val = true;
    }
    return val;
  }
}
