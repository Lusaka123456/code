import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MainCatPage } from '../main-cat/main-cat';
import { MainLoginPage } from '../main-login/main-login';
import { CarPage } from '../car/car';
import { WorkshopInfoPage } from '../workshop-info/workshop-info';
import { WorkshopPage } from '../workshop/workshop';
import { NotiPage } from '../noti/noti';
import { NewCalenderPage } from '../new-calender/new-calender';


/**
 * Generated class for the FooterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-footer',
  templateUrl: 'footer.html',
})
export class FooterPage {
  viewType: any = 0;
  viewHome: boolean=false;
  viewSearch: boolean=false;
  viewSaved: boolean=false;
  viewCar: boolean=false;
  viewGarage: boolean=false;
  viewCalendar: boolean=false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
    this.load();
    this.checkBtn();
  }

  checkBtn(){
    this.closeAll();
    if(localStorage.getItem('footerPageName')=='home'){
      this.viewHome=true;
    }

    if(localStorage.getItem('footerPageName')=='search'){
      this.viewSearch=true;
    }

    if(localStorage.getItem('footerPageName')=='car'){
      this.viewCar=true;
    }

    if(localStorage.getItem('footerPageName')=='saved'){
      this.viewSaved=true;
    }

    if(localStorage.getItem('footerPageName')=='garage'){
      this.viewGarage=true;
    }

    if(localStorage.getItem('footerPageName')=='calendar'){
      this.viewCalendar=true;
    }
  }

  closeAll(){
    this.viewHome=false;
    this.viewSearch=false;
    this.viewSaved=false;
    this.viewCar=false;
    this.viewGarage=false;
    this.viewCalendar=false;
  }

  load() {
    if (localStorage.getItem('token')) {
      if (localStorage.getItem('userType') == 'customer') {
        this.viewType = 1;
      } else {
        this.viewType = 2;
      }
    } else {
      this.viewType = 0;
    }
  }

  openHomePage() {
    if (localStorage.getItem('userType') == 'workshop') {
      this.navCtrl.setRoot(NotiPage);
    } else {
      this.navCtrl.setRoot(HomePage);
    }
  }

  openCategory() {
    if (localStorage.getItem('token')) {
      this.navCtrl.setRoot(MainCatPage);
    } else {
      this.navCtrl.setRoot(MainLoginPage);
    }
  }

  openCarGarage() {
    if (localStorage.getItem('token')) {
      if (localStorage.getItem('userType') == 'customer') {
        this.navCtrl.setRoot(CarPage)
      } else {
        this.navCtrl.setRoot(WorkshopInfoPage)
      }
    } else {
      this.navCtrl.setRoot(MainLoginPage);
    }
  }

  openFavCalender() {
    if (localStorage.getItem('token')) {
      if (localStorage.getItem('userType') == 'customer') {
        this.navCtrl.setRoot(WorkshopPage, { userId: 1 });
      } else {
        this.navCtrl.setRoot(NewCalenderPage)
      }
    } else {
      this.navCtrl.setRoot(MainLoginPage);
    }
  }

}
