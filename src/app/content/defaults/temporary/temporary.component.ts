import { Component } from '@angular/core';
import { fadeInAnimation } from '../../../modules/shared/utilities/route.animation';
import { UIService } from '../../../services/ui.service';

@Component({
  selector: 'temporary',
  templateUrl: './temporary.component.html',
  styleUrls: ['./temporary.component.scss']
})

export class TemporaryComponent {

  constructor(
    public ui: UIService
  ) {

  }

}
