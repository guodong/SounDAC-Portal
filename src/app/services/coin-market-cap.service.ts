import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class CoinMarketCapService {

    constructor(
        private http: Http
    ) { }

    getMarketCap() {
        return this.http.get('https://api.coinmarketcap.com/v1/ticker/bitshares-music/').map((res: Response) => res.json());
    }

}
