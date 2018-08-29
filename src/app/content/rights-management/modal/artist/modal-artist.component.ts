import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertBtnText } from '../../../../modules/shared/utilities/alert-btn-text.enums';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'artist',
  templateUrl: './modal-artist.component.html',
  styleUrls: ['./modal-artist.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ModalArtistComponent implements OnInit {
  aliases: string[];
  form: FormGroup;

  toolTips = {
    artist: 'ENTER THE NAME OF THE PERFORMING ARTIST.',
    isni: 'ENTER THE INTERNATIONAL STANDARD NAME IDENTIFIER HERE.',
    alias: 'ENTER ANY ALIASES OR ALTERNATIVE NAMES THAT THE PERFORMING ARTIST MAY BE KNOWN BY.',
    delay: '1000',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalArtistComponent>,
    private fb: FormBuilder
  ) { 

    this.form = fb.group({
      artist: fb.control('', Validators.required),
      isni: fb.control(''),
      alias: fb.control('')
    });
  }

  ngOnInit() {
    this.aliases = [];
  }

  addAlias() {
    if (this.data.alias) {
      this.aliases.push(this.data.alias);
      this.data.alias = '';
    }
  }

  removeAlias(i) {
    this.aliases.splice(i, 1);
  }

  btnClick(btnText) {
    const that = this;
    switch (btnText) {
      case AlertBtnText.Add:
        if (this.data.alias) {
          this.aliases.push(this.data.alias);
        }
        this.data.aliases = this.aliases;
        this.dialogRef.close(this.data);
        break;
      default:
        this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
