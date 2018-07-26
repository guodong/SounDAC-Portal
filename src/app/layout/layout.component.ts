import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { LoadingDialogComponent } from './dialogs/loading/loading.dialog.component';
import { UIService } from '../services/ui.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    private mediaMatcher: MediaMatcher,
    public ui: UIService
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
