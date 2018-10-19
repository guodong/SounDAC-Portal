import { Component, Input } from '@angular/core';
import { UIService } from '../../../services/ui.service';
import { SdacService } from '../../../services/sdac.service';

@Component({
  selector: 'advance-claim-of-stake',
  templateUrl: './claim-of-stake.component.html',
  styleUrls: ['./claim-of-stake.component.scss']
})
export class AdvanceClaimOfStakeComponent {

  constructor(
    private ui: UIService,
    private sdacService: SdacService
  ) { }

  @Input() username: string;
  inputWIF: string;

  claimWIF() {
    this.ui.showLoading();
    this.sdacService.claimBalance(this.username, this.inputWIF); // ToDo: Check Muse-js library to figure source of current error
  }

}
