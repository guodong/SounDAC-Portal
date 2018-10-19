// Core
import { Component, OnInit } from '@angular/core';
import { UIService } from '../../services/ui.service';

@Component({
  selector: 'music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {

  constructor(
    private ui: UIService
  ) { }

  stepUploadCompleted: boolean = false;
  stepTrackInfoCompleted: boolean = false;
  stepCompositionCompleted: boolean = false;
  stepRoyaltiesCompleted: boolean = false;

    ngOnInit(){
      // this.ui.showLoading();
    }

}
