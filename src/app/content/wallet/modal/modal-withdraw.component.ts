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

  inputAmount = '';
  getWeeklyAmount() {
    return ((Number.parseFloat(this.inputAmount) / 13) / Math.pow(10, 3)).toFixed(6);

    // console.log(Number(0.01).toFixed(6));
  }

  save() {
    this.dialogRef.close(this.inputAmount);
  }

  close() {
    this.dialogRef.close();
  }
}
