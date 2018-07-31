import * as cryptojs from 'crypto-js';
import { Utils } from '../modules/shared/utilities/utils';

export class MiniUser {

  constructor() {
    this.logged = false;
  }

  username: string;
  password: string;
  key: string;
  logged: boolean;

  getPassword(): string {
    return cryptojs.AES.decrypt(this.password, this.key).toString(cryptojs.enc.Utf8);
  }

  encryptPassword(password): string {

    // Encryption
    const key = Utils.generateKey();
    const encryptedPassword = cryptojs.AES.encrypt(password, key);

    // Set for User
    this.password = encryptedPassword;
    this.key = key;

    return key;
  }

  login(): boolean {

    // Verification of complete user
    if (this.username && this.password && this.key) {

      // Local Storage
      localStorage.setItem('username', this.username);
      localStorage.setItem('password', this.password);
      localStorage.setItem('key', this.key);

      // Update State
      this.logged = true;

    }

    return this.logged;
  }

}
