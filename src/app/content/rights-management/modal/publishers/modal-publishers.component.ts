import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertBtnText } from '../../../../modules/shared/utilities/alert-btn-text.enums';

@Component({
  selector: 'modal-publishers',
  templateUrl: './modal-publishers.component.html',
  styleUrls: ['./modal-publishers.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ModalPublishersComponent {
  form: FormGroup;

  toolTips = {
    sample: 'HINT.',
    delay: '1000',
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalPublishersComponent>,
    private fb: FormBuilder
  ) {

    this.form = fb.group({
      publisher: fb.control('', Validators.required),
      ISNI: fb.control(0),
      IPI_CAE: fb.control(''),
    });
  }

  close() {
    this.dialogRef.close();
  }

  btnClick(btnText) {
    //  this.data as DataService;
    const that = this;
    switch (btnText) {
      case AlertBtnText.Add:
        this.dialogRef.close(this.data);
        break;
      default:
        this.dialogRef.close();
    }
  }
}
