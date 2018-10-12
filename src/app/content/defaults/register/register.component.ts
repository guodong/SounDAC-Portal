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
import { TacComponent } from './terms-conditions/tac.component';

// Models
import { User } from '../../../models/user';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],

  // host: {
  //   '[@fadeInAnimation]': 'true'
  // },
  animations: [fadeInAnimation]
})
export class RegisterComponent {

  constructor(
    private auth: AuthService,
    private alert: AlertService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public ui: UIService
  ) {

    // Build Form
    this.form = fb.group({
  
      username: fb.control('', [Validators.required, Validators.pattern('^[a-z0-9_.-]{3,16}$')]),
      email: fb.control('', [Validators.required, Validators.email]),
      password: fb.control('', [Validators.required,  Validators.minLength(6)]),
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
        message: '\<p>\<b>Disclaimer: The SOUNDAC Portal ("Portal") is currently in its Beta stage.</b></p>\n <p> By accessing the Portal, you acknowledge and agree to be bound by the Disclaimer.\n If you do not agree to the Disclaimer, please do not use the Portal.\n Your use of the Portal constitutes your agreement to the Disclaimer.\n </p>\n <p><b>This is a Beta Release of the SOUNDAC Portal. </b></p>\n  <p>While we have done our best to ensure the accuracy\n of the application, any data presented by the Portal is offered \n with the assumption that you understand the Portal may be erroneous.</p>\n <p>\<b>WARNING: We cannot recover your funds or freeze your account if your private key or password is lost or stolen.</b></p>\n\<p> We \<b>cannot</b> Access your account or send your funds for you. Recover or change your private key. Recover or reset your password. Reverse, cancel, or refund transactions. Nor can we freeze accounts </p>\<p>\<b>If you lose your private key or password, no one can recover it and your funds will be lost.</b></p>\n<p>By proceeding with usage of the Portal Application, you agree that the Portal and affiliated companies are not liable for \n any lost assets or the accuracy of its data. \n We would like to thank you for taking part in this Beta Release.\nYour feedback will help us greatly improve the quality of the SOUNDAC Portal.\n</p>\n' ,
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
