import { SdacAccountHistory } from './sdac-account-history';
import { SdacKeys } from './sdac-keys';

export class SdacAccount {

    constructor(){
        this.keys = new SdacKeys();
        this.history = [];
        this.witnessVotes = [];
    }

    XsdBalance: string;
    Vestbalance: string;
    MBDbalance: string;
    NextwithDraw: Date;
    keys: SdacKeys;
    history: SdacAccountHistory[];
    witnessVotes: string[];
    streamingPlatformVotes: string[];

    mapAccount(sdacAccount: any){
        //console.log(sdacAccount); // Object from blockchain - Uncomment to view all properties

        this.keys.basicPubkey = sdacAccount.basic.key_auths[0][0];
        this.keys.activePubkey = sdacAccount.active.key_auths[0][0];
        this.keys.ownerPubkey = sdacAccount.owner.key_auths[0][0];
        this.keys.memoPubkey = sdacAccount.memo_key;
        this.XsdBalance = sdacAccount.balance.split(' ')[0];
        this.Vestbalance = sdacAccount.vesting_shares.split(' ')[0];
        this.MBDbalance = sdacAccount.mbd_balance.split(' ')[0];
        this.NextwithDraw = new Date(sdacAccount.next_vesting_withdrawal);
        this.witnessVotes = sdacAccount.witness_votes;
        this.streamingPlatformVotes = sdacAccount.streaming_platform_votes;
    }

}
