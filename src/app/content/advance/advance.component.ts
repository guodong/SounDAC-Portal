// Core
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

// Services
import { AuthService } from '../../services/auth.service';
import { SdacService } from '../../services/sdac.service';
import { UIService } from '../../services/ui.service';

// Models
import { SdacAccount } from '../../models/sdac-account';
import { SdacKeys } from '../../models/sdac-keys';
import { Subscription } from 'rxjs/Subscription';
import { SdacStreamingPlatform } from '../../models/sdac-streaming-platform';

@Component({
  selector: 'advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent implements OnInit, OnDestroy {

  constructor(
    private auth: AuthService,
    private sdacService: SdacService,
    private ui: UIService
  ) { }

  
  @ViewChild('paginatorStreamingPlatform') paginatorStreamingPlatform: MatPaginator;

  account: SdacAccount = new SdacAccount();
  subscription: Subscription;
  username: string;

  // Streaming Platforms
  StreamingPlatformListArray: SdacStreamingPlatform[] = [];
  dataSourceStreamingPlatforms = new MatTableDataSource<SdacStreamingPlatform>(this.StreamingPlatformListArray);
  displayedColumnsStreamingPlatforms = [''];
  inputStreamingPlatform: string;

  ngOnInit() {

    this.ui.showLoading();

    // Get Username
    this.subscription = this.auth.user$.map(user => {

      if (user) {

        // Get Username
        this.username = user.username;

        // Get Account Infos
        this.getAccount();
        this.getPrivateKeys();

      }

    }).subscribe();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  getAccount() {

    // Get Initial Account Info
    this.sdacService.getAccount(this.username).then(response => {
      this.account.mapAccount(response[0]);
      this.ui.hideLoading();
    });

    // Stream Account info for changes
    this.sdacService.streamAccountInfo$(this.username).subscribe(response => {
      this.account.mapAccount(response[0]);
      this.ui.hideLoading();
    });

  }

  getPrivateKeys() {
    const password = this.auth.user.getPassword();
    this.auth.getPrivateKeys(this.username, password).then((keys: SdacKeys) => {

      this.account.keys.basic = keys.basic;
      this.account.keys.active = keys.active;
      this.account.keys.owner = keys.owner;
      this.account.keys.memo = keys.memo;

    });
  }

  getStreamingPlatforms() {
    this.sdacService.getStreamingPlatforms().then(((result: any[]) => {
      console.log(result);
      // result.forEach(res => {
      //   console.log(res);
      //   const streamingPlatform: SdacStreamingPlatform = new SdacStreamingPlatform();
      //   streamingPlatform.map(res);
      //   // this.WitnessListArray.push(witness);
      //   this.dataSourceStreamingPlatforms.data.push(streamingPlatform);
      // });
      // this.dataSourceStreamingPlatforms.paginator = this.paginatorStreamingPlatform;
    }));
  }


}
