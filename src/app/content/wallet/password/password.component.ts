// Core
import { Component, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UIService } from '../../../services/ui.service';
import { AlertService } from '../../../services/alert.service';
import { SdacAccount } from '../../../models/sdac-account';

@Component({
  selector: 'wallet-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class WalletPasswordComponent {

  constructor(
    private auth: AuthService,
    private alert: AlertService,
    private fb: FormBuilder,
    private ui: UIService
  ) {

    // Password Form
    this.passwordForm = this.fb.group({
      password: this.fb.control('', Validators.required),
      newPassword: this.fb.control('', Validators.required),
      confirmPassword: this.fb.control('', Validators.required),
      understand: this.fb.control(null, Validators.required),
      saved: this.fb.control(null, Validators.required)
    });

  }

  @Input() account: SdacAccount;
  @Input() username: string;

  passwordForm: FormGroup;
  CurrentPass: string;
  generatedPassword: string;

  passwordMatch() {
    if (this.passwordForm.get('newPassword').value === this.passwordForm.get('confirmPassword').value) {
      return true;
    }
    this.passwordForm.get('confirmPassword').setErrors({ MatchPassword: true });
    return false;
  }

  updatePassword() {
    this.ui.showLoading();

    const truePassword: string = this.auth.user.getPassword();
    const password: string = this.passwordForm.get('password').value;
    const newPassword: string = this.passwordForm.get('newPassword').value;

    let errors: boolean = false;

    if (password !== truePassword) {
      this.alert.showErrorMessage('auth/wrong-password');
      this.passwordForm.get('password').reset();
      errors = true;
      this.ui.hideLoading();
    }

    if (!errors) {

      // Update the actual keys with the new password
      this.auth.updateAccountKeys(this.username, password, newPassword, this.account.keys.ownerPubkey, this.account.keys.activePubkey, this.account.keys.basicPubkey, this.account.keys.memoPubkey)
        .then((response: boolean) => {
          this.ui.hideLoading();
          if (response) {
            this.generatedPassword = null;
            this.passwordForm.reset();
          }
        });

    }

  }

}
