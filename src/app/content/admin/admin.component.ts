// Core
import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  constructor(
    public auth: AuthService,
    public admin: AdminService
  ) {

  }

  test(){
    console.log(Number(0.01).toFixed(6));
  }

}
