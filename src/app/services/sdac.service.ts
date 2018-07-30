// Angular & Rxjs
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

// Services
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

// Api
import * as sdac from 'museblockchain-js';
import { SdacAccountHistory } from '../models/sdac-account-history';

import { SdacKeys } from '../models/sdac-keys';
import { SdacAccount } from '../models/sdac-account';

@Injectable()
export class SdacService {

  constructor(
    private alertService: AlertService,
    private auth: AuthService,
  ) { }

  account: SdacAccount = new SdacAccount();

  setWebSocket() {
    sdac.config.set('websocket', 'wss://api.muse.blckchnd.com');
    // sdac.config.set('websocket', 'ws://rpc.museblockchain.com');
  }

  getAccount(userName): Promise<any> {
    this.setWebSocket();
    return sdac.api.getAccounts([userName]).catch((err) => {
      this.alertService.showErrorMessage('getAccount(): ' + err);
    });
  }

  streamAccountInfo$(userName): Observable<any> {
    this.setWebSocket();
    return new Observable((observer: Observer<any>) => {
      sdac.api.streamOperationsAsync((err, result) => {
        sdac.api.getAccounts([userName]).then((results => {
          observer.next(results);
        }), error => {
          this.alertService.showErrorMessage('streamAccountInfo$(): ' + error);
        });
      });
    });
  }

  getAccountHistory(userName): Promise<void | SdacAccountHistory[]> {
    this.setWebSocket();

    return new Promise<SdacAccountHistory[]>(function (resolve, reject) {
      sdac.api.getAccountHistory(userName, 9999, 24, function (error, result) {


        if (error) {
          reject(error);
        }

        if (!error) {

          const SdacAccountHistories: SdacAccountHistory[] = [];

          result.forEach(sdacHistory => {
            const accountHistory: SdacAccountHistory = new SdacAccountHistory();
            accountHistory.mapHistory(sdacHistory[1]);
            SdacAccountHistories.push(accountHistory);
          });

          resolve(SdacAccountHistories.reverse());

        }

      });
    }).catch((err) => {
      this.alertService.showErrorMessage('getAccountHistory(): ' + err);
    });

  }

  getWitnesses() {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      sdac.api.getWitnessesByVote('', 100, function (err, success) {
        if (err) {
          reject(err);
        } else {
          resolve(success);
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('getWitnesses(): ' + err);
    });
  }

  transferXsd(userName, password, transferTo, amount, memo) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      sdac.transferFunds(userName, password, transferTo, amount, memo, function (err, success) {
        if (err === -1) {
          reject(err);
        } else {
          resolve(success);
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('transferFunds(): ' + err);
    });
  }

  transferXsdtoVest(userName, password, amount) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      sdac.transferFundsToVestings(userName, password, null, amount, function (err, success) {
        if (err === -1) {
          reject(err);
        } else {
          resolve(success);
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('transferXsdtoVest(): ' + err);
    });
  }

  withdrawVesting(userName, password, amount) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      sdac.withdrawVesting(userName, password, amount, function (err, success) {
        if (err === -1) {
          reject(err);
        } else {
          resolve(success);
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('withdrawVesting(): ' + err);
    });
  }

  voteWitness(userName, password, witnessOwner: string, vote: boolean) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      sdac.witnessVote(userName, password, witnessOwner, vote, (code, message) => {
        if (code === 1) {
          resolve(true);
        } else {
          reject(message);
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('voteWitness(): ' + err);
    });
  }

  claimBalance(userName, wif) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {

      // sdac.claimBalance(userName, wif, (code, message) => {
      //   if (code === 1) {
      //     resolve(true);
      //   } else {
      //     reject(message);
      //   }
      // });

      // sdac.broadcast.balance_claim(musername, balance_to_claim, balance_owner_key, total_claimed, function (err, result) {
      //   if (err) {
      //     reject(err);
      //   } else {
      //     resolve(result);
      //   }
      // });

    }).catch((err) => {
      this.alertService.showErrorMessage('Sorry, Unable to process. Please check your WIF or try again later.');
    });
  }


  // loadPrivateKeys(userName: string) {
  //   const password = this.auth.user.getPassword();
  //   this.auth.getPrivateKeys(userName, password).then((keys: SdacKeys) => {
  //     this.account.keys.active = keys.active;
  //   });
  // }

  postContent(password, userName, content) {
    this.setWebSocket();
    const that = this;
    return new Promise(function (resolve, reject) {
      that.auth.getPrivateKeys(userName, password).then((keys: SdacKeys) => {
        
      sdac.broadcast.content(
        keys.active,
        userName,
        content.url,
        {
          part_of_album: content.album_meta.partOfAlbum,
          album_title: content.album_meta.albumTitle,
          album_artist: content.album_meta.albumArtists,
          genre_1: content.album_meta.albumGenre1,
          genre_2: content.album_meta.albumGenre2,
          country_of_origin: content.album_meta.countryOrigin,
          explicit_: content.album_meta.explicit,
          p_line: content.album_meta.albumPLine,
          c_line: content.album_meta.albumCLine,
          upc_or_ean: content.album_meta.upcEan,
          release_date: content.album_meta.releaseDate,
          release_year: content.album_meta.releaseYear,
          sales_start_date: content.album_meta.salesStartDate,
          album_producer: content.album_meta.albumProducer,
          album_type: content.album_meta.albumType,
          master_label_name: content.album_meta.masterLabelName,
          display_label_name: content.album_meta.displayLabelName,
        },
        {
          track_title: content.track_meta.trackTitle,
          ISRC: content.track_meta.isrc,
          track_artists: content.track_meta.trackArtists,
          featured_artist: content.track_meta.featuredArtist,
          featured_artist_ISNI: content.track_meta.featuredArtistIsni,
          track_producer: content.track_meta.trackProducer,
          genre_1: content.track_meta.trackGenre1,
          genre_2: content.track_meta.trackGenre2,
          p_line: content.track_meta.trackPLine,
          track_no: content.track_meta.trackNo,
          track_volume: content.track_meta.trackVolumeNo,
          copyright: content.track_meta.copyright,
          track_duration: content.track_meta.trackDuration,
          samples: content.track_meta.hasSample,
        },
        {
          composition_title: content.comp_meta.compTitle,
          alternate_composition_title: content.comp_meta.compTitleAlt,
          ISWC: content.comp_meta.compTitleIswc,
          third_party_publishers: content.comp_meta.isThirdPartyPublishers,
          publishers: content.comp_meta.publishers,
          writers: content.comp_meta.writers,
          PRO: content.comp_meta.performingRightsOrg,
        },
        
        content.distributions,
        content.management,
        content.management_threshold,
        content.distributionsComp,
        content.managementComp,
        content.management_threshold_comp,
        content.playing_reward,
        content.publishers_share,

        function (err, success) {
          if (err) {
            reject(err);
          } else {
            resolve(success);
          }
        });
    }).catch((err) => {
      this.alertService.showErrorMessage('postContent(): ' + err);
    });
  });
  }

  userExist(userName): Promise<any> {
    return this.getAccount(userName).then(
      user => {
        if (user.length !== 0) {
          return true;
        } else {
          return false;
        }
      }
    );
  }
}
