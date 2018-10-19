export class SdacStreamingPlatform {

    constructor() { }


    name: string;
    // last_confirmed_block_num: string;
    // url: string;

    map(data: any) {
        // console.log(data); // Blockchain Object - Uncomment to view all properties

        this.name = data;
        // this.last_confirmed_block_num = data.last_confirmed_block_num;
        // this.url = data.url;
    }

}
