export class MuseTransaction {
    transactionType: string;
    account: string;
    amount: string;
    approve: boolean;
    creator: string;
    deposited: string;
    from: string;
    fromAccount: string;
    id: string;
    json: string;
    memo: string;
    newAccountName: string;
    requiredAuths: string;
    requiredBasicAuths: string;
    to: string;
    toAccount: string;
    trxId: string;
    url: string;
    uploader: string;
    vestingShares: string;
    witness: string;

    mapTransaction(transactionArray: any) {

        // console.log(transactionArray); // Blockchain Object

        const transaction = transactionArray[1];

        this.trxId = transaction.trx_id;
        this.transactionType = transactionArray[0];
        this.account = transaction.account;
        this.approve = transaction.approve;
        this.creator = transaction.creator;
        this.from = transaction.from;
        this.fromAccount = transaction.from_account;
        this.id = transaction.id;
        this.json = transaction.json;
        this.memo = transaction.memo;
        this.newAccountName = transaction.newAccountName;
        this.requiredAuths = transaction.required_auths;
        this.requiredBasicAuths = transaction.required_basic_auths;
        this.to = transaction.to;
        this.toAccount = transaction.to_account;
        this.url = transaction.url;
        this.uploader = transaction.uploader;
        this.witness = transaction.witness;

        if (transaction.amount) {
            this.amount = transaction.amount.split(' ')[0];
        }

        if (transaction.deposited) {
            this.deposited = transaction.deposited.split(' ')[0];
        }

        if (transaction.vesting_shares) {
            this.vestingShares = transaction.vesting_shares.split(' ')[0];
        }
    }

}
