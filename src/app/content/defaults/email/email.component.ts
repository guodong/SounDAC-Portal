import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { fadeInAnimation } from '../../../modules/shared/utilities/route.animation';
import { AuthService } from '../../../services/auth.service';
import { UIService } from '../../../services/ui.service';

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  animations: [fadeInAnimation]
})

export class EmailComponent {

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    public ui: UIService
  ) {

    // Build Form
    this.form = fb.group({
      email: fb.control('', Validators.required),
    });

  }

  form: FormGroup;

  email() {

    this.auth.email(this.form.get('email').value);

  }

}
