import { MuseAccountHistory } from './muse-account-history';
import { MuseKeys } from './muse-keys';

export class MuseAccount {

    constructor(){
        this.keys = new MuseKeys();
        this.history = [];
        this.witnessVotes = [];
    }

    Musebalance: string;
    Vestbalance: string;
    MBDbalance: string;
    NextwithDraw: Date;
    keys: MuseKeys;
    history: MuseAccountHistory[];
    witnessVotes: string[];

    mapAccount(museAccount: any){
        // console.log(museAccount); // Object from blockchain - Uncomment to view all properties

        this.keys.basicPubkey = museAccount.basic.key_auths[0][0];
        this.keys.activePubkey = museAccount.active.key_auths[0][0];
        this.keys.ownerPubkey = museAccount.owner.key_auths[0][0];
        this.keys.memoPubkey = museAccount.memo_key;
        this.Musebalance = museAccount.balance.split(' ')[0];
        this.Vestbalance = museAccount.vesting_shares.split(' ')[0];
        this.MBDbalance = museAccount.mbd_balance.split(' ')[0];
        this.NextwithDraw = new Date(museAccount.next_vesting_withdrawal);
        this.witnessVotes = museAccount.witness_votes;
    }

}
