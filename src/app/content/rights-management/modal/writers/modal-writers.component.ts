  import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
  import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { AlertBtnText } from '../../../../modules/shared/utilities/alert-btn-text.enums';
  
  @Component({
    selector: 'modal-writers',
    templateUrl: './modal-writers.component.html',
    styleUrls    : ['./modal-writers.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
  
  export class ModalWritersComponent {
    form: FormGroup;
    selectedValue: string;

    roles = [
      { value: 0, view: 'Music' },
      { value: 1, view: 'Lyrics' },
      { value: 2, view: 'Music & Lyrics' },
      { value: 3, view: 'Arranger (for public domain works)' }
    ];

    toolTips = {
      writer: 'NAME OF THE WRITER',
      publisher: 'CAN BE SELF PUBLISHED',
      role: 'ROLE OF THE WRITER',
      ipicae: ' ',
      isni: ' ',
      delay: '1000',
    };

    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialogRef: MatDialogRef<ModalWritersComponent>,
      private fb: FormBuilder
    ) {
  
      this.form = fb.group({
        writer: fb.control(''),
        IPI_CAE: fb.control(''),
        ISNI: fb.control(''),
        publisher: fb.control(''),
        role: fb.control(''),
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
          this.dialogRef.close(this.form.value);
          break;
        default:
          this.dialogRef.close();
      }
    }
  }
