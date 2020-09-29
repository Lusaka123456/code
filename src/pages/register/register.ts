import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegsiterFormPage } from '../regsiter-form/regsiter-form';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() {
    
  }

  opneRegsiterForm(type: any){
    localStorage.setItem('userType', type);
    this.navCtrl.setRoot(RegsiterFormPage);
  }

}
