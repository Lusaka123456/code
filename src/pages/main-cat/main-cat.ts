import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Global } from '../../components/global';
import { TranslateService } from '@ngx-translate/core';
import { DataResponse } from '../../components/DataResponse';
import { CategoryPage } from '../category/category';
import { WorkshopPage } from '../workshop/workshop';
import { HomePage } from '../home/home';
import { MainLoginPage } from '../main-login/main-login';

/**
 * Generated class for the MainCatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-main-cat',
  templateUrl: 'main-cat.html',
})
export class MainCatPage {
  content: string;
  


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public global: Global,
    public translate: TranslateService) {
      localStorage.setItem('footerPageName', 'search');
  }

  ionViewDidLoad() {
    if(localStorage.getItem('token')){
      this.load();
    }else{
      this.navCtrl.setRoot(MainLoginPage);
    }
    
  }

  load() {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'services', {
      headers: this.global.noheader
    })
      .toPromise()
      .then((result: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        if (result.error == '200') {
          this.content = result.data;
        } else {
          this.global.alertMsg('error', 'server_400');
        }
      })
      .catch((error: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

  getSub(item: any) {
    if (item == '21' || item == '22') {
      this.navCtrl.setRoot(CategoryPage, { item: item });
    } else {
      this.navCtrl.setRoot(WorkshopPage, { catId: item });
    }
  }

  goBack() {
    this.navCtrl.setRoot(HomePage);
  }

  

  
}
