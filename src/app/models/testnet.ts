import { Timestamp } from '@firebase/firestore-types';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

export class TestnetReport {

  constructor(startTime?, running?, tps?) {
    startTime ? this.startTime = startTime : this.startTime = firebase.firestore.Timestamp.now();
    running ? this.running = running : this.running = true;
    tps ? this.tps = tps : this.tps = 0;
  }

  id: string;
  startTime: Timestamp;
  endTime: Timestamp;
  running: boolean;
  tps: number;
  totalTx: number;
  transactions: TestnetTransaction[];

  map(data, id?) {
    id ? this.id = id : this.id = '';
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

}

export class TestnetTransaction {

  constructor(reportId, startTime?) {
    this.reportId = reportId;
    startTime ? this.startTime = startTime : this.startTime = firebase.firestore.Timestamp.now();
  }

  reportId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  success: boolean;
  details: string;

  map(data, id?) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

}
