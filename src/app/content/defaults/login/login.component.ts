import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { fadeInAnimation } from '../../../modules/shared/utilities/route.animation';
import { AuthService } from '../../../services/auth.service';
import { UIService } from '../../../services/ui.service';
import { User } from '../../../models/user';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInAnimation]
})

export class LoginComponent {

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    public ui: UIService
  ) {

    // Build Form
    this.form = fb.group({
      username: fb.control('', Validators.required),
      password: fb.control('', Validators.required),
      // key: fb.control('')
    });

  }

  form: FormGroup;

  login() {
  
    // Building new User
    const user = new User();
    user.username = this.form.get('username').value; // Can pass email in this field too for sdac gateway
    user.password = this.form.get('password').value;

    // // Invitation Key
    // const key = this.form.get('key').value;~

    // // Login with User
    this.auth.login(user);

  }

}
