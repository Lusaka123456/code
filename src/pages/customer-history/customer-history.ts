import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Global } from '../../components/global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataResponse } from '../../components/DataResponse';
import { HomePage } from '../home/home';

/**
 * Generated class for the CustomerHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-customer-history',
  templateUrl: 'customer-history.html',
})
export class CustomerHistoryPage {

  historyList: any = [];
  requestList: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient) {
      localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() {
    this.load();
  }

  load() {
    this.global.loadingSpinner();
    // this.carHistory();
    this.requestHistory();
    this.global.customLoading.dismiss();
  }

  requestHistory() {
    this.http.get(this.global.url + 'customer-request-list', { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((reuslt: DataResponse<any>) => {
        console.log(reuslt);
        if (reuslt.error == 'success') {
          this.requestList = reuslt.data;
        }
      }).catch(error => {
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

  carHistory() {
    this.http.get(this.global.url + 'customer-history', { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((reuslt: DataResponse<any>) => {
        console.log(reuslt);
        if (reuslt.error == 'success') {
          this.historyList = reuslt.data;
        }
      }).catch(error => {
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

  goBack() {
    this.navCtrl.setRoot(HomePage);
  }

  cancel(carId: any, workshopId: any, requestId: any) {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'cancel-booking/' + carId + '/' + workshopId + '/' + requestId, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((reuslt: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        this.navCtrl.setRoot(CustomerHistoryPage);
      }).catch(error => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

}
