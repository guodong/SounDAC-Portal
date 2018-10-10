import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TestnetTransaction, TestnetReport } from '../../../../models/testnet';

@Component({
  selector: 'report-dialog',
  templateUrl: './report.dialog.component.html',
  styleUrls: ['./report.dialog.component.scss']
})
export class AdminTestnetReportDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AdminTestnetReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TestnetReport
  ) { }

  displayedColumns: string[] = ['startTime', 'endTime', 'executionTime', 'success'];

}
