import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { SdacService } from '../../../services/sdac.service';
import { UIService } from '../../../services/ui.service';
import { SdacAccount } from '../../../models/sdac-account';
import { SdacStreamingPlatform } from '../../../models/sdac-streaming-platform';

@Component({
  selector: 'advance-streaming',
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.scss']
})
export class AdvanceStreamingComponent implements OnInit {

  constructor(
    private sdacService: SdacService,
    private ui: UIService
  ) { }

  @Input() account: SdacAccount = new SdacAccount();
  @Input() username: string;
  @ViewChild('paginator') paginator: MatPaginator;

  dataSource = new MatTableDataSource<SdacStreamingPlatform>();
  displayedColumns = ['name'];
  inputVote: string;

  ngOnInit() {
    this.getStreamingPlatforms();
  }

  getStreamingPlatforms() {
    this.sdacService.getStreamingPlatforms().then(((results: string[]) => {
      results.forEach(res => {
        const streamingPlatform: SdacStreamingPlatform = new SdacStreamingPlatform();
        streamingPlatform.map(res);
        this.dataSource.data.push(streamingPlatform);
      });
      this.dataSource.paginator = this.paginator;
    }));
  }

  voteStreaming(streamingPlatformName: string, vote: boolean) {
    this.ui.showLoading();
    this.sdacService.voteStreamingPlatform(this.username, this.account.keys.active, streamingPlatformName, vote);
  }


}
