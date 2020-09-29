import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Global } from '../../components/global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataResponse } from '../../components/DataResponse';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ChangePassPage } from '../change-pass/change-pass';
import { CarPage } from '../car/car';
import { NotiPage } from '../noti/noti';
import { CustomerHistoryPage } from '../customer-history/customer-history';
import { MainLoginPage } from '../main-login/main-login';
import { AboutUsPage } from '../about-us/about-us';
import { ListGaragePage } from '../list-garage/list-garage';
import { ContactUsPage } from '../contact-us/contact-us';
import { HomePage } from '../home/home';
import { WorkshopInfoPage } from '../workshop-info/workshop-info';
import { ImageGallaryPage } from '../image-gallary/image-gallary';
import { NewCalenderPage } from '../new-calender/new-calender';

/**
 * Generated class for the HeaderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-header',
  templateUrl: 'header.html',
})
export class HeaderPage {
  pageTitle: string = '';
  notiCount: any = 0;
  showMenu: boolean = false;
  showUpload: boolean = false;
  userName: string = '';
  userImg: string = '';
  userType: string = '';
  base64Image: any;
  whatToShow: any = '';
  showLang: boolean = false;
  isLogin: boolean = false;
  showContactUs: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public alertCtrl: AlertController,
    public global: Global,
    public http: HttpClient,
    public plt: Platform,
    public camera: Camera) {
    this.getToken();
    if (navigator.onLine) {
      let key = localStorage.getItem('pageTitle');
      this.pageTitle = this.translate.instant(key);
      this.setLang();
      this.getSetting();
      if (localStorage.getItem('token')) {
        this.isLogin = true;
      }
      this.notification();
    } else {
      global.alertMsg('error', 'Sorry! No internet connection. عفوا!, لايوجد اتصال بالانترنت')
    }
  }

  ionViewDidLoad() {

  }

  setLang() {
    if (localStorage.getItem('lang') != null) {
      this.global.lang = localStorage.getItem('lang');
      this.global.align = localStorage.getItem('align');
      this.global.dirction = localStorage.getItem('dirction');
      this.global.otherAlign = localStorage.getItem('otherAlign');
      this.global.otherDirction = localStorage.getItem('otherDirction');
    } else {
      localStorage.setItem('lang', this.global.lang);
      localStorage.setItem('align', this.global.align);
      localStorage.setItem('dirction', this.global.dirction);
      localStorage.setItem('otherAlign', this.global.otherAlign);
      localStorage.setItem('otherDirction', this.global.otherDirction);
    }
    this.translate.setDefaultLang(this.global.lang);
    this.translate.use(this.global.lang);
    if(localStorage.getItem('token')){
      this.saveLangServer();
    }
  }

  saveLangServer(){
    this.http.get(this.global.url + 'server-lang/'+localStorage.getItem('lang'), 
    {headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) }).toPromise()
    .then().catch()
  }

  getSetting() {
    this.http.get(this.global.url + 'setting', {
      headers: this.global.noheader
    }).toPromise()
      .then((result: DataResponse<any>) => {
        if (result.error == '200') {
          localStorage.setItem('fees', result.data[0].value);
          localStorage.setItem('rate', result.data[1].value);
          localStorage.setItem('customer', result.data[2].value);
          localStorage.setItem('workshop', result.data[3].value);
          localStorage.setItem('sms', result.data[4].value);
          localStorage.setItem('scan', result.data[5].value);
        } else {
          this.global.alertMsg('error', 'server_400');
        }
      })
      .catch((error: DataResponse<any>) => {
        console.log(error);
        this.global.alertMsg('error', 'server_error');
      })
  }

  notification() {
    //this function get notification from database
    if (localStorage.getItem('token')) {
      this.http.get(this.global.url + 'noti', {
        headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") })
      }).toPromise()
        .then((result: DataResponse<any>) => {
          if (result.data.length > 0) {
            this.notiCount = result.data.length;
          } else {
            this.notiCount = '';
          }

        }).catch((error: DataResponse<any>) => {
          console.log(error);
          this.global.alertMsg('error', 'server_error');
        })
    }
  }

  getToken() {
    //this function get device token
    //if (!localStorage.getItem('device_token')) {
      this.plt.ready().then((readySource) => {
        (<any>window).FirebasePlugin.getToken((token) => {
          localStorage.setItem('device_token', token);
        }, function (error) {
          console.error(error);
        });

        (<any>window).FirebasePlugin.onTokenRefresh((token) => {
          localStorage.setItem('device_token', token);
        }, function (error) {
          console.error(error);
        });
        (<any>window).FirebasePlugin.setAnalyticsCollectionEnabled(true);
      });
    //}
  }

  openMenu() {
    if (localStorage.getItem('token')) {
      this.userName = localStorage.getItem('name');
      this.userImg = localStorage.getItem('image');
      this.userType = localStorage.getItem('userType');
      // this.showMenu = true;
    } else {
      localStorage.setItem('image', '../assets/imgs/user.png');
      this.userImg = localStorage.getItem('image');
      // localStorage.setItem('comFrom', 'home');
      // this.navCtrl.setRoot(MainLoginPage);
    }
    this.showMenu = true;
  }


  closeMenu() {
    this.showMenu = false;
    this.showUpload = false;
  }

  closeUpload() {
    this.showUpload = false;
  }

  logout() {
    this.showUpload = false;
    
    const alert = this.alertCtrl.create({
      title: this.translate.instant('logout'),
      message: this.translate.instant('logout-confirm-msg'),
      buttons: [
        {
          text: this.translate.instant('close')
        }, {
          text: this.translate.instant('logout-btn'),
          cssClass: 'logout',
          handler: () => {
            this.isLogin = false;
            localStorage.removeItem('token');
            localStorage.removeItem('image');
            localStorage.removeItem('name');
            localStorage.removeItem('userType');
            this.showMenu = false;
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });
    alert.present();
  }

  changePass() {
    this.navCtrl.setRoot(ChangePassPage);
  }

  myCars() {
    this.navCtrl.setRoot(CarPage);
  }

  uploadProfileImg() {
    if (localStorage.getItem('token')) {
      this.showUpload = true;
    } else {
      this.navCtrl.setRoot(MainLoginPage);
    }
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 300,
      targetHeight: 300,
      allowEdit: true,
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.uploadImage();
    }, (err) => {
      this.global.alertMsg('error', err);
    });
  }

  openGallery() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.uploadImage();
    }, (err) => {
      this.global.alertMsg('error', err);
    });
  }

  uploadImage() {
    this.global.loadingSpinner();
    this.http.post(this.global.url + 'upload-profile', { image: this.base64Image }, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((result: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        localStorage.setItem('image', this.global.imagePath + result.data);
        this.navCtrl.setRoot(HomePage);
      })
      .catch((error: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        this.global.alertMsg('error', error);
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

  openNoti() {
    if (localStorage.getItem('token')) {
      this.navCtrl.push(NotiPage);
    } else {
      this.navCtrl.setRoot(MainLoginPage);
    }
  }

  openCalender() {
    this.navCtrl.setRoot(NewCalenderPage)
  }

  opneCustomerHistory() {
    this.navCtrl.setRoot(CustomerHistoryPage)
  }

  changeLnag() {
    this.showLang = true;
  }

  changeToArabic() {
    this.global.lang = 'ar';
    this.global.align = 'right';
    this.global.dirction = 'rtl';
    this.global.otherAlign = 'left';
    this.global.otherDirction = 'ltr';
    localStorage.setItem('lang', this.global.lang);
    localStorage.setItem('align', this.global.align);
    localStorage.setItem('dirction', this.global.dirction);
    localStorage.setItem('otherAlign', this.global.otherAlign);
    localStorage.setItem('otherDirction', this.global.otherDirction);
    this.translate.setDefaultLang('ar');
    this.translate.use('ar');
    this.navCtrl.setRoot(HomePage);
    this.showLang = false;
  }

  changeToEnglish() {
    this.global.lang = 'en';
    this.global.align = 'left';
    this.global.dirction = 'ltr';
    this.global.otherAlign = 'right';
    this.global.otherDirction = 'rtl';
    localStorage.setItem('lang', this.global.lang);
    localStorage.setItem('align', this.global.align);
    localStorage.setItem('dirction', this.global.dirction);
    localStorage.setItem('otherAlign', this.global.otherAlign);
    localStorage.setItem('otherDirction', this.global.otherDirction);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.navCtrl.setRoot(HomePage);
    this.showLang = false;
  }

  closeLang() {
    this.showLang = false;
  }

  openAboutUs() {
    this.navCtrl.setRoot(AboutUsPage);
  }

  openListGarage() {
    this.navCtrl.setRoot(ListGaragePage);
  }

  openContactUs() {
    this.navCtrl.setRoot(ContactUsPage);
  }

  openLogin() {
    this.navCtrl.setRoot(MainLoginPage);
  }

  openContactList() {
    this.showContactUs = true;
  }

  closeContactUs() {
    this.showContactUs = false;
  }

  garageInfo() {
    this.navCtrl.setRoot(WorkshopInfoPage);
  }

  imageGallary() {
    this.navCtrl.setRoot(ImageGallaryPage);
  }

}
