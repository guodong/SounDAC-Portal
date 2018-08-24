import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SdacKeys } from '../../../../models/sdac-keys';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../../../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../../../models/user';

@Component({
  selector: 'modal-key',
  templateUrl: './modal-key.component.html',
})
export class ModalKeyComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalKeyComponent>,
    private afs:AngularFirestore,
    public auth:AngularFireAuth,
  ) {}

  key = '';

  save() {
      this.dialogRef.close(this.key);
  }
 
  close() {
    this.dialogRef.close();
  }
}
