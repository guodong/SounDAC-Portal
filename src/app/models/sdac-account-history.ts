import { SdacTransaction } from './sdac-transaction';

export class SdacAccountHistory {

    constructor(){}

    id: string;
    date: Date;
    block: number;
    transaction: SdacTransaction;

    mapHistory(accountHistory: any){
        // console.log(accountHistory); // Blockchain Object
        this.id = accountHistory.id;
        this.date = accountHistory.timestamp;
        this.block = accountHistory.block;
        this.transaction = new SdacTransaction();
        this.transaction.mapTransaction(accountHistory.op);
    }

}
