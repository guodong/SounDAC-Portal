// Core
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as sdac from 'museblockchain-js';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';

import { Observable } from 'rxjs/Observable';
import { UIService } from '../services/ui.service';

// Models
import { TestnetReport, TestnetTransaction } from '../models/testnet';

@Injectable()
export class AdminTestnetService {

  constructor(
    private ui: UIService
  ) { }

  public dummyTests: TestnetReport[] = [
    new TestnetReport(firebase.firestore.Timestamp.now(), true, 20),
    new TestnetReport(firebase.firestore.Timestamp.now(), false, 17),
    new TestnetReport(firebase.firestore.Timestamp.now(), false, 15)
  ];

  private db = firebase.app('sdacApi');

  getReports(): Observable<TestnetReport[]> {

    // Returning has observable so list update itself when running a new report or deleting one
    return new Observable(observer => {
      this.db.firestore().collection('testnet-reports').orderBy('startTime', 'desc').onSnapshot((querySnapshot) => {
        const reports: TestnetReport[] = [];
        querySnapshot.docs.forEach(function (doc) {
          const report: TestnetReport = new TestnetReport();
          report.map(doc.data(), doc.id);
          reports.push(report);
        });
        observer.next(reports);
      });
    });

  }

  getReportTransactions(reportId): Promise<TestnetTransaction[]> {
    return this.db.firestore().collection('testnet-transactions').orderBy('startTime', 'asc').where('reportId', '==', reportId).get().then(function (querySnapshot) {
      const transactions: TestnetTransaction[] = [];
      querySnapshot.forEach(function (doc) {
        const tx: TestnetTransaction = new TestnetTransaction(doc.data().reportId);
        tx.map(doc.data());
        transactions.push(tx);
      });
      return transactions;
    });
  }

  deleteReport(report: TestnetReport): Promise<boolean> {

    // Delete Report
    return firebase.firestore().collection('testnet-reports').doc(report.id).delete().then(function (docRef) {

      // Delete Transactions of report
      return firebase.firestore().collection('testnet-transactions').where('reportId', '==', report.id).get().then(function (querySnapshot) {

        // Create a batch for atomic delete
        const batch = firebase.firestore().batch();

        // Fill the batch
        querySnapshot.forEach(function (doc) {
          batch.delete(doc.ref);
        });

        // Execute the deletes
        return batch.commit().then(result => {
          return true;
        }).catch(error => {
          return false;
        });

      });

    }).catch(function (error) {
      return false;
    });
  }

  runPerformanceTest(txToSend: number) {

    // Create a new Report
    const report: TestnetReport = new TestnetReport(firebase.firestore.Timestamp.now(), true, 0);
    const me = this;

    // Create & Save Report
    this.db.firestore().collection('testnet-reports').add(Object.assign({}, report)).then(function (docRef) {

      const promises = [];

      // Execute Transactions
      for (let i = 0; i < txToSend; i++) {

        // Do the blockchain TX and Return a promise of the result
        promises.push(me.setTx(docRef.id));

      }

      // Once all transactions has been executed
      Promise.all(promises).then(function (values: TestnetTransaction[]) {

        // Declare Batch & Transactions
        const batch = me.db.firestore().batch();

        // Set Report SUM (Use for Average TPS Calc)
        let sum = 0;

        values.forEach((tx) => {

          // Add Only tx who succeeded
          if (tx.success) {
            sum += (1 / (tx.endTime.seconds - tx.startTime.seconds)); // Percentage of a second
          }

          // Declare a Firestore Document Reference
          const doc = me.db.firestore().collection('testnet-transactions').doc();

          // Insert Into Batch
          batch.set(doc, tx);

        });

        // Atomic Write Batch to Firestore (Reduce Firebase utilisations & cost)
        batch.commit().then(() => {

          // Update Report
          report.running = false;
          report.endTime = firebase.firestore.Timestamp.now();

          // Calc TPS
          report.tps = sum / values.length;
          report.totalTx = values.length;

          // Save
          docRef.update(Object.assign({}, report)).then(ref => {
            console.log('Report Updated');
            console.log(report);
          }).catch(error => {
            console.log('Firestore - Transactions');
            console.log(error);
          });

        }).catch(error => {
          console.log(error);
        });

      });

    }).catch(function (error) {
      console.log('Firestore - Report');
      console.log(error);
    });


  }

  setTx(reportId): Promise<TestnetTransaction> {

    return new Promise((resolve) => {

      // Create a new tx
      let tx: TestnetTransaction = new TestnetTransaction(reportId, firebase.firestore.Timestamp.now());

      // Set Websocket
      sdac.config.set('websocket', environment.websocket.test);

      // Transfer XSD Transaction
      sdac.transferFunds(
        environment.testAccounts.sender.username, // Sender
        environment.testAccounts.sender.password, // Sender Password
        environment.testAccounts.receiver.username, // Receiver
        ((Math.random() * 0.0009) + 0), // Random Amount (Blockchain block duplicate transactions in a short period)
        '', // Memo
        function (err, success) {

          if (err === -1) {
            tx.success = false;
          } else {
            tx.success = true;
          }

          tx.endTime = firebase.firestore.Timestamp.now();
          tx = Object.assign({}, tx);
          resolve(tx);

        }
      );

    });

  }

}
