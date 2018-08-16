import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'modal-vest',
  templateUrl: './modal-vest.component.html'
})
export class ModalDialogVestComponent {
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalDialogVestComponent>
  ) { }

  inputAmount = '';

  save() {
    // alert(this.data.balance);
    this.dialogRef.close(this.inputAmount);
  }

  close() {
    this.dialogRef.close();
  }
}
