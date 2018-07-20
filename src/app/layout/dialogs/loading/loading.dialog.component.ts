import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.dialog.component.html',
  styleUrls: ['./loading.dialog.component.scss']
})
export class LoadingDialogComponent {

  @Input('isLoading') isLoading: boolean;
  @Input('loadingMessage') loadingMessage: string;

  constructor() { }

}
