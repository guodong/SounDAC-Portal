import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertBtnText, ErrorCodes } from '../modules/shared/utilities/enums';
import { AlertDialogComponent } from '../layout/dialogs/alert/alert.dialog.component';
import { UIService } from './ui.service';


@Injectable()
export class AlertService {

  constructor(
    private dialog: MatDialog,
    private ui: UIService
  ) { }

  private errorMessages = {

    // Firebase Error Messages
    accountExistsWithDifferentCredential: { title: 'Account Exists!', message: 'An account with the same credential already exists.' },
    invalidCredential: { title: 'Invalid Credential!', message: 'An error occured logging in with this credential.' },
    operationNotAllowed: { title: 'Login Failed!', message: 'Logging in with this provider is not allowed! Please contact support.' },
    userDisabled: { title: 'Account Disabled!', message: 'Sorry! This account has been suspended! Please contact support.' },
    userNotFound: { title: 'Account Not Found!', message: 'Sorry, an account with this credential could not be found.' },
    wrongPassword: { title: 'Incorrect Password!', message: 'Sorry, the password you have entered is incorrect.' },
    invalidEmail: { title: 'Invalid Email!', message: 'Sorry, you have entered an invalid email address.' },
    emailAlreadyInUse: { title: 'Email Not Available!', message: 'Sorry, this email is already in use.' },
    weakPassword: { title: 'Weak Password!', message: 'Sorry, you have entered a weak password.' },
    providerAlreadyLinked: { title: 'Already Linked!', message: 'Sorry, your account is already linked to this credential.' },
    credentialAlreadyInUse: { title: 'Credential Not Available!', message: 'Sorry, this credential is already used by another user.' },
    userNameAlreadyInUse: { title: 'Username Not Available!', message: 'Sorry, this Username is already in use.' },

    // Catch all error
    default: { title: 'Error', message: 'Please contact support with the following error message: ' }

  };

  private successMessages = {
    emailVerified: { title: 'Email Confirmed!', message: 'Congratulations! Your email has been confirmed!' },
    emailVerificationSent: { title: 'Email Confirmation Sent!', message: 'Please confirm your email sent to ' },
    passwordChanged: { title: 'Password Changed!', message: 'Your password has been successfully changed.' },

    // Catch all Success
    default: { title: 'Success', message: '' }

  };

  showEmailVerificationSentMessage(email) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      disableClose: true,
      data: {
        title: this.successMessages.emailVerificationSent['title'],
        message: this.successMessages.emailVerificationSent['message'] + email + ' before continuing.'
        // btnStart: AlertBtnText.UpdateEmail,
        // btnEnd: AlertBtnText.ResendEmail
      }
    });

  }

  showEmailVerified() {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      disableClose: true,
      data: {
        title: this.successMessages.emailVerified['title'],
        message: this.successMessages.emailVerified['message'],
        btnEnd: AlertBtnText.OK
      }
    });
  }

  showSuccessMessage(title: string, message: string) {
    this.dialog.open(AlertDialogComponent, {
      disableClose: true,
      data: {
        title: title,
        message: message,
        btnEnd: AlertBtnText.OK
      }
    });
  }

  // Show error messages depending on the code
  // If you added custom error codes on top, make sure to add a case block for it.
  showErrorMessage(code) {
    switch (code) {
      // Firebase Error Messages
      case ErrorCodes.emailAlreadyInUse:
        this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          data: {
            title: this.errorMessages.emailAlreadyInUse['title'],
            message: this.errorMessages.emailAlreadyInUse['message'],
            btnEnd: AlertBtnText.OK
          }
        });
        break;
      case ErrorCodes.userNameAlreadyInUse:
        this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          data: {
            title: this.errorMessages.userNameAlreadyInUse['title'],
            message: this.errorMessages.userNameAlreadyInUse['message'],
            btnEnd: AlertBtnText.OK
          }
        });
        break;
      case ErrorCodes.wrongPassword:
        this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          data: {
            title: this.errorMessages.wrongPassword['title'],
            message: this.errorMessages.wrongPassword['message'],
            btnEnd: AlertBtnText.OK
          }
        });
        break;
      default:
        this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          data: {
            title: this.errorMessages.default['title'],
            message: this.errorMessages.default['message'] + code,
            btnEnd: AlertBtnText.OK
          }
        });
    }

    // Avoid loading after errors
    this.ui.hideLoading();

  }

  closeAll() {
    this.dialog.closeAll();
  }
}
