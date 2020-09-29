import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';

/**
 * Generated class for the MainLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-main-login',
  templateUrl: 'main-login.html',
})
export class MainLoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() {
  }

  openFirstLogin(type: any) {
    localStorage.setItem('userType', type);
    this.navCtrl.setRoot(LoginPage);
  }

}
