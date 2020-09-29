import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Global } from '../../components/global';
import { HttpClient } from '@angular/common/http';
import { DataResponse } from '../../components/DataResponse';
import { WorkshopPage } from '../workshop/workshop';
import { MainCatPage } from '../main-cat/main-cat';

/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  catId: any;
  content: any;
  

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient) {
    this.catId = navParams.get('item');
    localStorage.setItem('footerPageName', 'search');
  }

  ionViewDidLoad() {
    this.load();
  }

  goBack() {
    this.navCtrl.setRoot(MainCatPage);
  }

  load() {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'sub-services/' + this.catId, {
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

  getWorkshop(item: any) {
    this.navCtrl.setRoot(WorkshopPage, {subCatId: item});
  }

}