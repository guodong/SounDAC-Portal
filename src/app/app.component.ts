import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Observable } from 'rxjs/rx';
import { MediaMatcher } from '@angular/cdk/layout';
import { LoadingDialogComponent } from './layout/dialogs/loading/loading.dialog.component';
import { UIService } from './services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private mediaMatcher: MediaMatcher,
    private ui: UIService
  ) { }

  @ViewChild('sidenav') sidenav;
  mediaQueryList;

  ngOnInit() {
    this.mediaQueryList = this.mediaMatcher.matchMedia('(max-width: 768px)');
  }

  sidenavToggle() {
    this.sidenav.toggle();
  }

}
