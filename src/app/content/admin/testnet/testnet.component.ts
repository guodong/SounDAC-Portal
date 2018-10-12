// Core
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AdminTestnetReportDialogComponent } from './report-dialog/report.dialog.component';
import { DeleteDialogComponent } from '../../../layout/dialogs/delete/delete.dialog.component';
import { Subscription } from 'rxjs/Subscription';

// Services
import { AdminTestnetService } from '../../../services/admin-testnet.service';
import { UIService } from '../../../services/ui.service';

// Models
import { TestnetReport } from '../../../models/testnet';

@Component({
  selector: 'admin-testnet',
  templateUrl: './testnet.component.html',
  styleUrls: ['./testnet.component.scss']
})
export class AdminTestnetComponent implements OnInit, OnDestroy {

  constructor(
    private adminTestnetService: AdminTestnetService,
    private ui: UIService,
    public dialog: MatDialog
  ) {
  }

  private subscription: Subscription;
  displayedColumns: string[] = ['startTime', 'endTime', 'totalTx', 'tps', 'running', 'actions'];
  dataSource: TestnetReport[] = [];

  ngOnInit() {
    this.getReports();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getReports() {
    // this.ui.showLoading();
    // this.unsubscribe();
    this.subscription = this.adminTestnetService.getReports().subscribe(reports => {
      this.dataSource = reports;
      // this.ui.hideLoading();
    });
  }

  runPerformanceTest(durationInSecond) {
    this.adminTestnetService.runPerformanceTest(durationInSecond);
  }

  viewReport(report: TestnetReport) {

    // Fill Report Transactions
    this.adminTestnetService.getReportTransactions(report.id).then(result => {

      report.transactions = result;

      // Open Dialog
      this.dialog.open(AdminTestnetReportDialogComponent, {
        width: 'auto',
        data: report
      });

    });

  }

  confirmDelete(item: TestnetReport) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: 'this report', item: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(result);
      }
    });
  }

  delete(report: TestnetReport) {
    this.adminTestnetService.deleteReport(report);
  }

}
