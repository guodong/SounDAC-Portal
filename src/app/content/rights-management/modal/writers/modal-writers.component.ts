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
      writer: 'ENTER THE NAME OF THE WRITER OF THE RECORDED WORK.',
      publisher: 'ENTER THE NAME OF THE PUBLISHER OF THIS SPECIFIC WRITER--OR THE RECORDED WORK MAY BE SELF PUBLISHED.',
      role: 'ENTER THE ROLE THAT THIS SPECIFIC WRITER PLAYED IN THIS COMPOSITION AND RECORDING.',
      ipicae: 'ENTER THE INTERESTED PARTIES INFORMATION NUMBER (ALSO KNOWN AS COMPOSER, AUTHOR, PUBLISHER OR CAE NUMBER) HERE.',
      isni: 'ENTER THE INTERNATIONAL STANDARD NAME IDENTIFIER HERE.',
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
