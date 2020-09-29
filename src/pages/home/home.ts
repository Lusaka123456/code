import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Global } from '../../components/global';
import { LoginPage } from '../login/login';
import { TranslateService } from '@ngx-translate/core';
import { DataResponse } from '../../components/DataResponse';
import { WorkshopDetailsPage } from '../workshop-details/workshop-details';
import { NotiPage } from '../noti/noti';
import { Geolocation } from '@ionic-native/geolocation';
import { WorkshopPage } from '../workshop/workshop';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  featured: any = [];
  latest: any = [];
  nearYou: any = [];
  featuredData: any = [];
  latestData: any = [];
  nearYouData: any = [];
  latitude: any = '';
  longitude: any = '';
  savedList: any = [];


  constructor(public navCtrl: NavController,
    public http: HttpClient,
    public global: Global,
    public translate: TranslateService,
    public platform:Platform,
    public geolocation: Geolocation) {
    localStorage.setItem('pageTitle', 'homepage');
    localStorage.setItem('footerPageName', 'home');
  }

  ionViewDidLoad() {
    this.platform.ready().then((res)=>
    {
      if (localStorage.getItem('token')) {
        if (localStorage.getItem('userType') == 'workshop') {
          this.navCtrl.setRoot(NotiPage)
        } else {
          this.load();
        }
      } else {
        this.load();
      }
    })
   
  }

  load() {
    this.platform.ready().then((res)=>
    {
      this.global.loadingSpinner();
      if (localStorage.getItem('token')) {
        this.loadNearYou()
          .then(val => {
            this.loadFeatured().then(seocndVal => {
              this.loadLatest().then(thirdVal => {
                this.getSavedList()
              })
            })
          });
      } else {
        this.loadNearYou()
          .then(val => {
            this.loadFeatured().then(seocndVal => {
              this.loadLatest();
            })
          });
      }
    });
    
  }

  filterSaved() {
    if (localStorage.getItem('token')) {
      let normalArray: any = [];
      for (var i = 0; i < this.savedList.length; i++) {
        normalArray[i] = this.savedList[i].workshop_id
      }
      for (var j = 0; j < this.featured.length; j++) {
        if (normalArray.indexOf(this.featured[j].id)==-1) {
          this.featured[j].saved = false;
        } else {
          this.featured[j].saved = true;
        }
        this.featuredData.push(this.featured[j]);
      }
      for (var k = 0; k < this.nearYou.length; k++) {
        if (normalArray.indexOf(this.nearYou[k].id)!=-1) {
          this.nearYou[k].saved = true;
        } else {
          this.nearYou[k].saved = false;
        }
        this.nearYouData.push(this.nearYou[k]);
      }
      for (var n = 0; n < this.latest.length; n++) {
        if (normalArray.indexOf(this.latest[n].id)==-1) {
          this.latest[n].saved = false;
        } else {
          this.latest[n].saved = true;
        }
        this.latestData.push(this.latest[n]);
      }
    }
  }

  getSavedList() {
    if (localStorage.getItem("token")) {
      this.http.get(this.global.url + 'saved-list', { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
        .toPromise()
        .then((data: DataResponse<any>) => {
          if (data.error == 'no_data_found') {
            this.savedList = '';
          } else if (data.error == 'success') {
            this.savedList = data.data;
          }
          this.filterSaved();
        }).catch(error => {
          console.log(error)
          this.global.alertMsg('error', 'server_error');
        });
    }
  }

  async loadFeatured() {
    this.http.get(this.global.url + 'getFeatured', {
      headers: this.global.noheader
    })
      .toPromise()
      .then((result: DataResponse<any>) => {
        if (result.error == 'success') {
          this.featured = result.data;
          if (!localStorage.getItem('token')) {
            this.featuredData = this.featured;
          }
        } else {
          this.global.alertMsg('error', 'server_400');
        }
      })
      .catch((error: DataResponse<any>) => {
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

  async loadLatest() {
    this.http.get(this.global.url + 'getLatest', {
      headers: this.global.noheader
    })
      .toPromise()
      .then((result: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        if (result.error == 'success') {
          this.latest = result.data;
          if (!localStorage.getItem('token')) {
            this.latestData = this.latest;
          }
        } else {
          this.global.alertMsg('error', 'server_400');
        }
      })
      .catch((error: DataResponse<any>) => {
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

  async loadNearYou() {
  //   let sortedBy = 'distance';
  //  // let resp = await this.geolocation.getCurrentPosition()
  //  this.geolocation.getCurrentPosition().then(async resp=>
  //   {
  //     this.latitude = resp.coords.latitude
  //     this.longitude = resp.coords.longitude
  //     let url = this.global.url + 'home?page=1&lat=' + this.latitude + '&lng=' + this.longitude + '&APP_KEY=AIzaSyACIsdq0JB_EvzWdGE440diybxTtQGG79w&sort=' + sortedBy + '&lang=' + this.global.lang;
  //     let result = await this.http.get(url, {
  //       headers: this.global.noheader
  //     }).toPromise()
  //     if (result['error'] == '200') {
  //       this.nearYou = result['data'].data;
  //       //console.log(localStorage.getItem('token'))
  //       //if (!localStorage.getItem('token')) {
  //         this.nearYouData = this.nearYou;
  //       //}
  //     } else {
  //       this.global.alertMsg('error', 'server_400');
  //     }
  //   }).catch(async e=>
  //     {
  //       this.latitude = "25.204849"
  //       this.longitude = "55.270782"
  //       let url = this.global.url + 'home?page=1&lat=' + this.latitude + '&lng=' + this.longitude + '&APP_KEY=AIzaSyACIsdq0JB_EvzWdGE440diybxTtQGG79w&sort=' + sortedBy + '&lang=' + this.global.lang;
  //       let result = await this.http.get(url, {
  //         headers: this.global.noheader
  //       }).toPromise()
  //       if (result['error'] == '200') {
  //         this.nearYou = result['data'].data;
  //         //if (!localStorage.getItem('token')) {
  //           this.nearYouData = this.nearYou;
  //         //}
  //       } else {
  //         this.global.alertMsg('error', 'server_400');
  //       }
  //     })
try{
  let sortedBy = 'distance';
  let resp = await this.geolocation.getCurrentPosition()
  this.latitude = resp.coords.latitude
  this.longitude = resp.coords.longitude
  let url = this.global.url + 'home?page=1&lat=' + this.latitude + '&lng=' + this.longitude + '&APP_KEY=AIzaSyACIsdq0JB_EvzWdGE440diybxTtQGG79w&sort=' + sortedBy + '&lang=' + this.global.lang;
  let result = await this.http.get(url, {
    headers: this.global.noheader
  }).toPromise()
  if (result['error'] == '200') {
    this.nearYou = result['data'].data;
    if (!localStorage.getItem('token')) {
      this.nearYouData = this.nearYou;
    }
  } else {
    this.global.alertMsg('error', 'server_400');
  }
}
catch(e)
{
  console.log(e)
}
    
  }

  openWorkshopDetails(id: any) {
    this.navCtrl.setRoot(WorkshopDetailsPage, { id: id });
  }

  openFirstLogin(type: any) {
    localStorage.setItem('userType', type);
    this.navCtrl.setRoot(LoginPage);
  }

  openNearYou() {
    this.navCtrl.setRoot(WorkshopPage, { filter: 'distance' });
  }

  openFeatred() {
    this.navCtrl.setRoot(WorkshopPage, { search: 'GetFeaturedGarage' });
  }

}
