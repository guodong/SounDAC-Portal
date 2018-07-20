import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor() { }

  @Output() sidenavToggle: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  private settings: Observable<any>;

  toggle() {
    this.sidenavToggle.next();
  }

}
