import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CarAddPage } from '../car-add/car-add';

/**
 * Generated class for the CarScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-car-scan',
  templateUrl: 'car-scan.html',
})
export class CarScanPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() {
    
  }

  goBack(){
    this.navCtrl.setRoot(CarAddPage)
  }

}
