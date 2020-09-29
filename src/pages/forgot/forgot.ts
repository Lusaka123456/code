import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ResetEmailPage } from '../reset-email/reset-email';
import { ResetMobilePage } from '../reset-mobile/reset-mobile';

/**
 * Generated class for the ForgotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() {
   
  }

  goBack(){
    this.navCtrl.setRoot(LoginPage)
  }

  openRestPass(item: any){
    if(item=='email'){
      this.navCtrl.setRoot(ResetEmailPage);
    }else if(item=='mobile'){
      this.navCtrl.setRoot(ResetMobilePage);
    }
  }

}
