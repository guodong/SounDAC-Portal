import * as cryptojs from 'crypto-js';
import { Utils } from '../modules/shared/utilities/utils';
import { Roles } from './roles';
import { Timestamp } from '../../../node_modules/@firebase/firestore-types';

export class User {

    constructor(id?: string, musername?: string, email?: string, key?: string, roles?: Roles) {
        id ? this.id = id : this.id = null;
        musername ? this.musername = musername : this.musername = '';
        email ? this.email = email : this.email = '';
        key ? this.key = key : this.key = null;
        roles ? this.roles = roles : this.roles = new Roles();
    }

    id: string;
    musername: string;
    email: string;
    password: string;
    key: string;
    roles: Roles;
    dateCreated: Date;

    getPassword(): string {
        return cryptojs.AES.decrypt(sessionStorage.getItem('password'), this.key).toString(cryptojs.enc.Utf8);
    }

    encryptPassword(password): string {

        // Encryption
        const key = Utils.generateKey();
        const encryptedPassword = cryptojs.AES.encrypt(password, key);

        // Set for User
        sessionStorage.setItem('password', encryptedPassword);
        this.key = key;

        return key;
    }

}
