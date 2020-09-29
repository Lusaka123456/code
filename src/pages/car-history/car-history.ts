import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CarPage } from '../car/car';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Global } from '../../components/global';
import { DataResponse } from '../../components/DataResponse';

/**
 * Generated class for the CarHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-car-history',
  templateUrl: 'car-history.html',
})
export class CarHistoryPage {
  carId: any;
  historyList: any = [];
  carImage: string;
  vehicleType: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient) {
    this.carId = navParams.get('carId');
    localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() {
    this.load();
  }

  goBack() {
    this.navCtrl.setRoot(CarPage);
  }

  load() {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'car-history/' + this.carId, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((data: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        console.log(data);
        if (data.error == 'success') {
          this.historyList = data.data;
          if(data.data[0].image!=null){
            this.carImage = this.global.imagePath + data.data[0].image;
          }else{
            this.carImage = '../../assets/imgs/car.png';
          }
          this.vehicleType = data.data[0].vehicle_type;
        }
        
      }).catch(error => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

}
