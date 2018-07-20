import { MuseTransaction } from './muse-transaction';

export class MuseAccountHistory {

    constructor(){}

    id: string;
    date: Date;
    block: number;
    transaction: MuseTransaction;

    mapHistory(accountHistory: any){
        // console.log(accountHistory); // Blockchain Object
        this.id = accountHistory.id;
        this.date = accountHistory.timestamp;
        this.block = accountHistory.block;
        this.transaction = new MuseTransaction();
        this.transaction.mapTransaction(accountHistory.op);
    }

}
