// Angular & Rxjs
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

// Services
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';
import { Utils } from '../modules/shared/utilities/utils';

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
  rylt = '2.28.2';

  setWebSocket() {
    sdac.config.set('websocket', 'wss://api.muse.blckchnd.com');
    // sdac.config.set('websocket', 'ws://35.238.124.181:8090');
  }

  getAccount(username): Promise<any> {
    this.setWebSocket();
    return sdac.api.getAccounts([username]).catch((err) => {
      this.alertService.showErrorMessage('getAccount(): ' + err);
    });
  }

  streamAccountInfo$(username): Observable<any> {
    this.setWebSocket();
    return new Observable((observer: Observer<any>) => {
      sdac.api.streamOperationsAsync((err, result) => {
        sdac.api.getAccounts([username]).then((results => {
          observer.next(results);
        }), error => {
          this.alertService.showErrorMessage('streamAccountInfo$(): ' + error);
        });
      });
    });
  }

  getAccountContent(username): Promise<any> {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      sdac.api.getContentByUploader(username, function (err, success) {
        if (err) {
          reject(err);
        } else {
          resolve(success);
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('getAccountContent(): ' + err);
    });
  }

  getAccountHistory(username): Promise<void | SdacAccountHistory[]> {
    this.setWebSocket();

    return new Promise<SdacAccountHistory[]>(function (resolve, reject) {
      sdac.api.getAccountHistory(username, 9999, 24, function (error, result) {


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

  transferXsd(username, password, transferTo, amount, memo) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      sdac.transferFunds(username, password, transferTo, amount, memo, function (err, success) {
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

  transferXsdtoVest(username, activeKey, amount) {
    this.setWebSocket();
    const that = this;
    return new Promise(function (resolve, reject) {
      console.log(amount);
      sdac.transferFundsToVestings(username, activeKey, null, amount, function (err, success) {
        if (err === -1) {
          reject(err);
        } else {
          resolve(success);
          that.alertService.showCustomMessage('Success', '');
        }
      });
    }).catch((err) => {
      this.alertService.showErrorMessage('transferXsdtoVest(): ' + err);
    });
  }

  redeemRylt(username, activeKey, amount) {
    this.setWebSocket();
    const that = this;
    const requestId = Utils.generateRequestId();
      return new Promise(function (resolve, reject) {
        sdac.broadcast.convert(activeKey, username, requestId, amount + ' ' + that.rylt, function (err, success) {
          if (err) {
            reject(err);
          } else {
            resolve(success);
            that.alertService.showCustomMessage('Success', 'Your redeemed RYLT tokens will be available as XSD in 3.5 days.');
          }
        });
    }).catch((err) => {
      this.alertService.showErrorMessage('redeemRylt(): ' + err);
    });
  }

  withdrawVesting(username, password, amount) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      sdac.withdrawVesting(username, password, amount, function (err, success) {
        if (err === -1) {
          reject(err);
        } else {
          resolve(success);
        }
      });
    }).catch((err) => {
      // this.alertService.showErrorMessage('withdrawVesting(): ' + err);
    });
  }

  voteWitness(username, password, witnessOwner: string, vote: boolean) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {
      sdac.witnessVote(username, password, witnessOwner, vote, (code, message) => {
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

  claimBalance(username, wif) {
    this.setWebSocket();
    return new Promise(function (resolve, reject) {

      // sdac.claimBalance(username, wif, (code, message) => {
      //   if (code === 1) {
      //     resolve(true);
      //   } else {
      //     reject(message);
      //   }
      // });

      // sdac.broadcast.balance_claim(username, balance_to_claim, balance_owner_key, total_claimed, function (err, result) {
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


  // loadPrivateKeys(username: string) {
  //   const password = this.auth.user.getPassword();
  //   this.auth.getPrivateKeys(username, password).then((keys: SdacKeys) => {
  //     this.account.keys.active = keys.active;
  //   });
  // }

  postContent(password, username, content) {
    this.setWebSocket();
    const that = this;
    return new Promise(function (resolve, reject) {
      that.auth.getPrivateKeys(username, password).then((keys: SdacKeys) => {

        sdac.broadcast.content(
          keys.active,
          username,
          content.url,
          // content.album_meta,

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

  userExist(username): Promise<any> {
    return this.getAccount(username).then(
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
