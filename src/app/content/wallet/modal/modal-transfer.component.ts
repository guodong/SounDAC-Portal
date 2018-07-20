import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'modal-transfer',
  templateUrl: './modal-transfer.component.html',
})
export class ModalTransferComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalTransferComponent>
  ) { }

  data = {
    'transferto': '',
    'amount': '',
    'memo': ''
  };

  save() {
    if (this.data.transferto === '') {
      alert('Please provide a Muse account name to transfer to.');
    } else {
      this.dialogRef.close(this.data);
    }
  }
  
  close() {
    this.dialogRef.close();
  }
}
