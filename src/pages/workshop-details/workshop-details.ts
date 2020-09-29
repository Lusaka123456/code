import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform, Slides } from 'ionic-angular';
import { WorkshopPage } from '../workshop/workshop';
import { Global } from '../../components/global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataResponse } from '../../components/DataResponse';
import { Subscription } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation';
import { HomePage } from '../home/home';
import { MainLoginPage } from '../main-login/main-login';
import { CarPage } from '../car/car';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

/**
 * Generated class for the WorkshopDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google;

@Component({
  selector: 'page-workshop-details',
  templateUrl: 'workshop-details.html',
})
export class WorkshopDetailsPage {
  @ViewChild('mapservice') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;
  postionSubscription: Subscription;

  karajId: any;
  karajInfo: any = [];
  imageList: any = [];
  imageLogo: any;
  viewRate: any;
  openDetails: boolean = false;
  location: boolean = false;
  contact: boolean = false;
  fullBG: boolean = false;
  car: boolean = false;
  carList: any = [];
  showDirection: boolean;
  favorite: boolean = false;
  commentList: any = [];
  viewCommentList: boolean = false;
  commintLisCount: any = 0;
  latitude: any;
  longitude: any;
  serviceData:any =[];
  brandData:any =[];


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private launchNavigator: LaunchNavigator,
    public global: Global,
    public http: HttpClient,
    public geolocation: Geolocation,
    public platform: Platform) {
    this.karajId = navParams.get('id');
    localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() {
    this.load();
    this.showDirection = false;
  }

  goBack() {
    this.navCtrl.setRoot(WorkshopPage)
  }

  favoriteList() {
    if (localStorage.getItem('token')) {
      this.http.get(this.global.url + 'favorite-details/' + this.karajId, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
        .toPromise()
        .then((result: DataResponse<any>) => {
          if (result.error == 'success') {
            if (result.data) {
              this.favorite = true;
            }
          } else {
            this.global.alertMsg('error', 'server_error');
          }
        })
        .catch((error: DataResponse<any>) => {
          console.log(error)
          this.global.alertMsg('error', 'server_error');
        });
    }
  }

  load() {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'details/' + this.karajId)
      .toPromise()
      .then((result: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        if (result.error == 'success') {
          this.favoriteList();
          this.karajInfo = result.data;
          this.imageList = result.imageList;
          this.imageLogo = this.global.imagePath + this.karajInfo.logo;
          this.viewRate = localStorage.getItem('rate');
          this.commentList = result.commentList
          this.commintLisCount = this.commentList.length;
          this.serviceData = result.workshopCat;
          this.brandData = result.carModel;
          console.log(result);
          if (localStorage.getItem('fees') == 'Free') {
            this.openDetails = true;
          }
          if (localStorage.getItem('payment') == 'complete') {
            this.openDetails = true;
          }
        } else {
          this.global.alertMsg('error', 'server_error');
        }
      })
      .catch((error: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

  openComentList() {
    this.viewCommentList = true;
  }

  save(carId: any) {
    //this function call api
    this.closeFaseBox();
    this.global.loadingSpinner();
    this.http.post(this.global.url + 'booking', { carId: carId, workshopId: this.karajId }, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((data: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        if (data.error == 'success') {
          this.global.alertMsg('success', 'booking_success');
          this.navCtrl.setRoot(HomePage);
        } else {
          this.global.alertMsg('error', 'server_error');
        }
      })
      .catch((error: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

  getCarsList() {
    if (localStorage.getItem('token')) {
      this.global.loadingSpinner();
      this.http.get(this.global.url + 'car-list-booking', { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
        .toPromise()
        .then((data: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          if (data.error == 'no_data_found') {
            this.carList = '';
            this.navCtrl.setRoot(CarPage);
          } else if (data.error == 'success') {
            this.fullBG = true;
            this.car = true;
            this.carList = data.data;
          }
        })
        .catch((error: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          console.log(error)
          this.global.alertMsg('error', 'server_error');
        });
    } else {
      this.navCtrl.setRoot(MainLoginPage)
    }
  }

  openLocation() {
    if (localStorage.getItem('token')) {
      if (!this.openDetails) {
        this.global.alertMsg('alert', 'make_book');
      } else {
        this.fullBG = true;
        this.location = true;

        let latitude = parseFloat(this.karajInfo.google_lat);
        let longitude = parseFloat(this.karajInfo.google_lng);
        this.latitude = latitude;
        this.longitude = longitude;
        if (document.getElementById('mapservice') === null || typeof (document.getElementById('mapservice')) === 'undefined') {
          setTimeout(() => {
            this.openLocation();
          }, 500);
        } else {
          this.map = new google.maps.Map(document.getElementById('mapservice'), {
            center: { lat: latitude, lng: longitude },
            zoom: 17
          });

          this.startNavigating();

          var position = new google.maps.LatLng(latitude, longitude);
          var museumMarker = new google.maps.Marker({ position: position, title: this.karajInfo.en_name });
          museumMarker.setMap(this.map);
        }
      }
      this.showDirection = true;
    } else {
      this.navCtrl.setRoot(MainLoginPage);
    }
  }

  getMapElement() {
    if (document.getElementById('mapservice') === null || typeof (document.getElementById('mapservice')) === 'undefined') {
      setTimeout(() => {
        this.getMapElement();
      }, 500);
    } else {
      return document.getElementById('mapservice');
    }
  }

  openContent() {
    if (localStorage.getItem('token')) {
      if (!this.openDetails) {
        this.global.alertMsg('alert', 'make_book');
      } else {
        this.fullBG = true;
        this.contact = true;
      }
    } else {
      this.navCtrl.setRoot(MainLoginPage);
    }
  }

  closeFaseBox() {
    this.fullBG = false;
    this.contact = false;
    this.location = false;
    this.car = false;
    this.viewCommentList = false;
  }

  startNavigating() {
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let directionsService = new google.maps.DirectionsService;
      let directionsDisplay = new google.maps.DirectionsRenderer;

      directionsDisplay.setMap(this.map);
      // directionsDisplay.setPanel(this.directionsPanel.nativeElement);

      let start = latLng;
      let end = new google.maps.LatLng(parseFloat(this.karajInfo.google_lat), parseFloat(this.karajInfo.google_lng));

      directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode['DRIVING']
      }, (res, status) => {

        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(res);
        } else {
          console.warn(status);
        }

      });

    }, (err) => {
      console.log(err);
    });
  }

  addToFav() {
    if (localStorage.getItem('token')) {
      this.global.loadingSpinner();
      this.http.post(this.global.url + 'add-favorite', { workshopId: this.karajId }, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
        .toPromise()
        .then((data: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          this.favorite = true;
        })
        .catch((error: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          console.log(error)
          this.global.alertMsg('error', 'server_error');
        });
    } else {
      this.navCtrl.setRoot(MainLoginPage)
    }
  }

  removeFromFav() {
    if (localStorage.getItem('token')) {
      this.global.loadingSpinner();
      this.http.post(this.global.url + 'remove-favorite', { workshopId: this.karajId }, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
        .toPromise()
        .then((data: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          this.favorite = false;
        })
        .catch((error: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          console.log(error)
          this.global.alertMsg('error', 'server_error');
        });
    } else {
      this.navCtrl.setRoot(MainLoginPage)
    }
  }

  @ViewChild(Slides) slides: Slides;
  slidePrev() {
    this.slides.slidePrev();
  }
  slideNext() {
    this.slides.slideNext();
  }

  openNativMap() {
    let destination = this.latitude + ',' + this.longitude;
    console.log(destination);

    if (this.platform.is('ios')) {
      let options: LaunchNavigatorOptions = {
        app: this.launchNavigator.APP.GOOGLE_MAPS
      };
      
      this.launchNavigator.navigate([this.latitude, this.longitude], options)
        .then(
          success => console.log('Launched navigator'),
          error => console.log('Error launching navigator', error)
        );
    } else {
      let label = encodeURI('My Label');
      window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
    }
  }

  openWhastaap(number: any){
    //whatsapp://{{karajInfo.whatsapp}}
    window.open('whatsapp://?' + number, '_system');
  }

}
