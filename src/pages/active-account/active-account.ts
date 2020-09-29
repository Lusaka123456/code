import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ActiveAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-active-account',
  templateUrl: 'active-account.html',
})
export class ActiveAccountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() {
    
  }

  goBack(){
    this.navCtrl.setRoot(LoginPage);
  }

}
