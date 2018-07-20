export class MuseWitness {

    constructor(){}

    owner: string;
    last_confirmed_block_num: string;
    url: string;

    mapWitness(data: any){
        // console.log(data); // Blockchain Object - Uncomment to view all properties
        this.owner = data.owner;
        this.last_confirmed_block_num = data.last_confirmed_block_num;
        this.url = data.url;
    }

}
