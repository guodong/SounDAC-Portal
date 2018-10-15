export class SdacContent {

    constructor(){}

    owner: string;
    uploaded: Date;
    title: string;
    url: string;
    timesplayed: string

    mapContent(data: any){
        //console.log(data); // Blockchain Object - Uncomment to view all properties
        this.owner = data.uploader;
        this.uploaded = new Date(data.created);
        this.title = data.track_meta.track_title;
        this.url = data.url;
        this.timesplayed = data.times_played;
    }

}
