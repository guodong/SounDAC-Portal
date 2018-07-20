import { Component } from '@angular/core';
import { MatDialogRef  } from '@angular/material';

@Component({
  selector: 'modal-withdraw',
  templateUrl: './modal-withdraw.component.html'
})

export class ModalWithdrawComponent {
  
  constructor(
    public dialogRef: MatDialogRef<ModalWithdrawComponent>
  ) {}

  data = '';

  save() {
    this.dialogRef.close(this.data);
  }

  close() {
    this.dialogRef.close();
  }
}
