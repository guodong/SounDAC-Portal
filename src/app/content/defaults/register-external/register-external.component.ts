// Core
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

// Utilities
import { fadeInAnimation } from '../../../modules/shared/utilities/route.animation';
import { AlertBtnText } from '../../../modules/shared/utilities/enums';

// Services
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { UIService } from '../../../services/ui.service';

// Components
import { LoadingDialogComponent } from '../../../layout/dialogs/loading/loading.dialog.component';
import { TacComponent } from '../register/terms-conditions/tac.component';

// Models
import { User } from '../../../models/user';

@Component({
  selector: 'register-external',
  templateUrl: './register-external.component.html',
  styleUrls: ['./register-external.component.scss'],
  animations: [fadeInAnimation]
})
export class RegisterExternalComponent {

  constructor(
    private auth: AuthService,
    private alert: AlertService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public ui: UIService
  ) {

    // Build Form
    this.form = fb.group({
      username: fb.control('', Validators.required),
      email: fb.control('', [Validators.required, Validators.email]),
      password: fb.control('', Validators.required),
      passwordConfirm: fb.control('', Validators.required),
      terms: fb.control(false, Validators.required),
      ackLoss: fb.control(false, Validators.required),
      ackPw: fb.control(false, Validators.required)
    });

  }

  form: FormGroup;

  termsAndCond() {
    this.dialog.open(TacComponent, {
      disableClose: true,
      data: {
        title: 'Terms and Conditions',
        message: '\<p>\<b>Disclaimer: PeerTracks is currently in its Beta stage.</b></p>\n<p> By accessing the PeerTracks, you acknowledge and agree to be bound by the Disclaimer.\n If you do not agree to the Disclaimer, please do not use PeerTracks.\n Your use of the PeerTracks constitutes your agreement to the Disclaimer.\n </p>\n<p><b>This is a Beta Release of PeerTracks. While we have done our best to ensure the accuracy\n of the application, any data presented by PeerTracks is offered \n with the assumption that you understand PeerTracks may be erroneous. </b></p>\n<p>By proceeding with usage of the PeerTracks Application, you agree that PeerTracks and affiliated companies are not liable for \n any lost assets or the accuracy of its data. \n We would like to thank you for taking part in this Beta Release.\nYour feedback will help us greatly improve the quality of PeerTracks.\n</p>\n',
        btnEnd: AlertBtnText.Close
      }
    });
  }

  passwordMatch() {
    if (this.form.get('password').value === this.form.get('passwordConfirm').value) {
      return true;
    }
    this.form.get('passwordConfirm').setErrors({ MatchPassword: true });
    return false;
  }

  register() {

    const user = new User();

    user.username = this.form.get('username').value;
    user.email = this.form.get('email').value;    
    user.password = this.form.get('password').value;

    // Register
    this.auth.register(user);

  }

}
