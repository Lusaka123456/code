import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Global } from '../../components/global';

/**
 * Generated class for the AboutUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public global: Global) {
      localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() {
    
  }

  goBack(){
    this.navCtrl.setRoot(HomePage);
  }

}
