//Core
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, PageEvent, MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';

//Services
import { SdacService } from '../../services/sdac.service';
import { AuthService } from '../../services/auth.service';
import { UIService } from '../../services/ui.service';

//Models
import { SdacContent } from '../../models/sdac-content';
import { Subscription } from '../../../../node_modules/rxjs/Subscription';

@Component({
  selector: 'content-rights-management',
  templateUrl: './rights-management.component.html',
  styleUrls: ['./rights-management.component.scss']
})
export class RightsManagementComponent implements OnInit, OnDestroy {

  constructor(
    private sdacService: SdacService,
    private auth: AuthService,
    private ui: UIService,
    private router: Router
  ) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorContent') paginatorContent: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  subscription: Subscription;
  username: any;
  ContentListArray: SdacContent[] = [];
  dataSourceContent = new MatTableDataSource<SdacContent>(this.ContentListArray);
  displayedColumnsContent = ['title', 'url', "timesplayed", 'uploaded',];

  ngOnInit(){

    this.ui.showLoading();

    this.subscription = this.auth.user$.map(user => {

      if (user) {

        // this.auth.user = user; // Update User
        this.username = user.username;
        this.loadcontents();
      }
    }).subscribe(user => {

    });

  }

  loadcontents() {
    this.sdacService.getAccountContent(this.username).then(((result: any[]) => {
      result.forEach(res => {
        const content: SdacContent = new SdacContent();
        content.mapContent(res);
        this.dataSourceContent.data.push(content);
      });
      this.dataSourceContent.paginator = this.paginatorContent;
      this.dataSourceContent.sort = this.sort;
      this.ui.hideLoading();
    }));
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  test(param) {
    //console.log(param);
  }
}
