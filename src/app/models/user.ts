import * as cryptojs from 'crypto-js';
import { Utils } from '../modules/shared/utilities/utils';
import { Roles } from './roles';
import { Timestamp } from '../../../node_modules/@firebase/firestore-types';

export class User {

    constructor(id?: string, username?: string, email?: string, key?: string, roles?: Roles) {
        id ? this.id = id : this.id = null;
        username ? this.username = username : this.username = '';
        email ? this.email = email : this.email = '';
        key ? this.key = key : this.key = null;
        roles ? this.roles = roles : this.roles = new Roles();
    }

    id: string;
    username: string;
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

    map(data, id?) {
        id ? this.id = id : this.id = '';
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }

}
