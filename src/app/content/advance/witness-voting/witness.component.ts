import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { SdacService } from '../../../services/sdac.service';
import { UIService } from '../../../services/ui.service';
import { SdacAccount } from '../../../models/sdac-account';
import { SdacWitness } from '../../../models/sdac-witness';

@Component({
  selector: 'advance-witness',
  templateUrl: './witness.component.html',
  styleUrls: ['./witness.component.scss']
})
export class AdvanceWitnessComponent implements OnInit {

  constructor(
    private sdacService: SdacService,
    private ui: UIService
  ) { }

  @Input() account: SdacAccount = new SdacAccount();
  @Input() username: string;

  @ViewChild('paginator') paginator: MatPaginator;

  dataSource = new MatTableDataSource<SdacWitness>();
  displayedColumns = ['owner', 'block', 'url'];
  inputWitness: string;

  ngOnInit() {
    this.getWitnesses();
  }

  getWitnesses() {
    this.sdacService.getWitnesses().then(((result: any[]) => {
      result.forEach(res => {
        const witness: SdacWitness = new SdacWitness();
        witness.mapWitness(res);
        this.dataSource.data.push(witness);
      });
      this.dataSource.paginator = this.paginator;
    }));
  }

  voteWitness(witnessOwner: string, vote: boolean) {
    this.ui.showLoading();
    this.sdacService.voteWitness(this.username, this.account.keys.active, witnessOwner, vote);
  }

}
