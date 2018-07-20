import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'modal-vest',
  templateUrl: './modal-vest.component.html'
})

export class ModalDialogVestComponent {
  
  constructor(
    public dialogRef: MatDialogRef<ModalDialogVestComponent>
  ) { }

  data = '';

  save() {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }

  close() {
    this.dialogRef.close();
  }

}
