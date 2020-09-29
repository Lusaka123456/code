import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Global } from '../../components/global';
import { PaginationResponse } from '../../components/PaginationResponse';
import { DataResponse } from '../../components/DataResponse';
import { Geolocation } from '@ionic-native/geolocation';
import { WorkshopDetailsPage } from '../workshop-details/workshop-details';
import { MainCatPage } from '../main-cat/main-cat';
import { MainLoginPage } from '../main-login/main-login';

/**
 * Generated class for the WorkshopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-workshop',
  templateUrl: 'workshop.html',
})
export class WorkshopPage {
  dataContent: any = [];
  viewData: any = [];
  nextPage = 1;
  maxPage = 1;
  viewRate = 'no'
  latitude: any = '';
  longitude: any = '';
  userId: any = null;
  catId: any = '';
  subCatId: any ='';
  search: any ='';
  pageTitle: any= '';
  sortedBy: string = 'name';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public global: Global,
    public geolocation: Geolocation) {
    this.getParams();
    
  }

  getParams(){
    this.userId = this.navParams.get('userId');
    if(this.userId!='undefined' && this.userId!=null){
      this.pageTitle='favorite';
      localStorage.setItem('footerPageName', 'saved');
    }else{
      this.pageTitle='garage';
      localStorage.setItem('footerPageName', 'search');
    }
    this.catId = this.navParams.get('catId');
    this.subCatId = this.navParams.get('subCatId');
    this.search = this.navParams.get('search');
    this.sortedBy = this.navParams.get('filter');
    console.log(this.sortedBy);
  }

  ionViewDidLoad() {

    if(localStorage.getItem('token')){
      this.load();
    this.viewRate = localStorage.getItem('rate');
    }else{
      this.navCtrl.setRoot(MainLoginPage);
    }
    
  }

  sortBy(sort: string){
    this.sortedBy=sort;
    this.nextPage=0;
    this.dataContent=[];
    this.viewData=[];
    this.load();
  }

  load() {
    this.global.loadingSpinner();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude
      this.longitude = resp.coords.longitude
      let url = '';
      if (this.userId != 'undefined' && this.userId!=null) {
        url = this.global.url + 'favorite?page=' + this.nextPage + '&lat=' + this.latitude + '&lng=' + this.longitude + '&APP_KEY=AIzaSyACIsdq0JB_EvzWdGE440diybxTtQGG79w&userId=1&sort='+this.sortedBy+'&lang='+this.global.lang;
        this.http.get(url, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
          .toPromise()
          .then((result: PaginationResponse<any>) => {
            this.global.customLoading.dismiss();
            if (result.error == '200') {
              this.dataContent = result.data.data;
              this.maxPage = result.last_page;
              for (var i = 0; i < this.dataContent.length; i++) {
                this.viewData.push(this.dataContent[i]);
              }
              this.nextPage++;
            } else {
              this.global.alertMsg('error', 'server_400');
            }
          })
          .catch((error: DataResponse<any>) => {
            this.global.customLoading.dismiss();
            console.log(error)
            this.global.alertMsg('error', 'server_error');
          });
      } else {
        url='';
        if(this.catId!=null){
          url = this.global.url + 'home?page=' + this.nextPage + '&lat=' + this.latitude + '&lng=' + this.longitude + '&APP_KEY=AIzaSyACIsdq0JB_EvzWdGE440diybxTtQGG79w&catId='+this.catId+'&sort='+this.sortedBy+'&lang='+this.global.lang;
        }else if(this.subCatId!=null){
          url = this.global.url + 'home?page=' + this.nextPage + '&lat=' + this.latitude + '&lng=' + this.longitude + '&APP_KEY=AIzaSyACIsdq0JB_EvzWdGE440diybxTtQGG79w&subCatId='+this.subCatId+'&sort='+this.sortedBy+'&lang='+this.global.lang;
        }else if(this.search!=null){
          url = this.global.url + 'home?page=' + this.nextPage + '&lat=' + this.latitude + '&lng=' + this.longitude + '&APP_KEY=AIzaSyACIsdq0JB_EvzWdGE440diybxTtQGG79w&search='+this.search+'&sort='+this.sortedBy+'&lang='+this.global.lang;
        }else{
          url = this.global.url + 'home?page=' + this.nextPage + '&lat=' + this.latitude + '&lng=' + this.longitude + '&APP_KEY=AIzaSyACIsdq0JB_EvzWdGE440diybxTtQGG79w&sort='+this.sortedBy+'&lang='+this.global.lang;
        }
        this.http.get(url, {
          headers: this.global.noheader
        })
          .toPromise()
          .then((result: PaginationResponse<any>) => {
            this.global.customLoading.dismiss();
            if (result.error == '200') {
              this.dataContent = result.data.data;
              this.maxPage = result.last_page;
              for (var i = 0; i < this.dataContent.length; i++) {
                this.viewData.push(this.dataContent[i]);
              }
              this.nextPage++;
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

    }).catch((error) => {
      this.global.customLoading.dismiss();
      console.log(error);
      if (error.message) {
        this.global.alertMsg('error', error.message);
      }
      console.log('Error getting location', error);
    });

  }

  doInfinite(infiniteScroll: any) {
    if (this.nextPage <= this.maxPage) {
      return this.load();
    } else {
      infiniteScroll.complete();
    }
  }

  goBack() {
    this.navCtrl.setRoot(MainCatPage)
  }

  openWorkshopDetails(id: any) {
    this.navCtrl.setRoot(WorkshopDetailsPage, { id: id });
  }

}
