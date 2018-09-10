import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class NavbarMenuComponent {

  constructor(
    public auth: AuthService
  ) { }

  onSupportNav() {
    window.open('https://support.soundac.io', '_blank');
  }

}
