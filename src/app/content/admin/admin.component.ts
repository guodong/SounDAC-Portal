// Core
import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  constructor(
    public auth: AuthService,
    public admin: AdminService,
    private http: HttpClient,
  ) {

  }

  private url = environment.apiUrl + 'soundac/';

  testAPI(){

    const body: any = {
      username: 'dom'
    };

    // Post Test
    this.http.post(this.url + 'getAccount', body).subscribe((response: any) => {
      console.log(response);
    });

  }

}
