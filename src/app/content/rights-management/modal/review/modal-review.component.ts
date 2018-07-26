import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertBtnText } from '../../../../modules/shared/utilities/alert-btn-text.enums';
import { UIService } from '../../../../services/ui.service';

@Component({
  selector: 'modal-review',
  styleUrls: ['modal-review.component.scss'],
  templateUrl: './modal-review.component.html',
})
export class ModalReviewComponent implements OnInit {
  agree = false;
  public formData: any;
  public trackArtists: any;
  public albumArtists: any;
  public writers: any;
  public publishers: any;
  public masterRoyalty: any;
  public compRoyalty: any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalReviewComponent>,
    private ui: UIService
  ) { }

  ngOnInit() {
    this.formData = this.data[0];
    this.trackArtists = this.data[1].value;
    this.albumArtists = this.data[2].value;
    this.writers = this.data[3].value;
    this.publishers = this.data[4].value;
    this.masterRoyalty = this.data[5];
    this.compRoyalty = this.data[6];
  }

  save(btnText?) {
    const that = this;
    switch (btnText) {
      case AlertBtnText.Post:
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
