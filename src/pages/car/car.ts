import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CarAddPage } from '../car-add/car-add';
import { Global } from '../../components/global';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { DataResponse } from '../../components/DataResponse';
import { CarHistoryPage } from '../car-history/car-history';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpHeaders } from '@angular/common/http';
import { CarManualPage } from '../car-manual/car-manual';

/**
 * Generated class for the CarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-car',
  templateUrl: 'car.html',
})
export class CarPage {
  carList: any = [];
  historyList: any = [];
  status: boolean = false;
  divId: any;
  showUpload: boolean = false;
  base64Image: any;
  carId: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient,
    public translate: TranslateService,
    public camera: Camera,
    public alertCtrl: AlertController, ) {
      localStorage.setItem('footerPageName', 'car');
  }

  ionViewDidLoad() {
    this.load();
  }

  goBack() {
    this.navCtrl.setRoot(HomePage);
  }

  openAddCar() {
    if(localStorage.getItem('scan')=='Yes'){
      this.navCtrl.setRoot(CarAddPage);
    }else{
      this.navCtrl.setRoot(CarManualPage);
    }
  }

  load() {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'car-list', { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((data: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        if (data.error == 'no_data_found') {
          this.carList = '';
        } else if (data.error == 'success') {
          this.carList = data.data;
        }
      }).catch(error => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

  viewDetails(id: any) {
    this.showUpload = false;
    if (!this.status) {
      this.divId = id;
      this.status = true;
    } else {
      this.divId = '';
      this.status = false;
    }
  }

  carHistory(id: any) {
    this.navCtrl.setRoot(CarHistoryPage, { carId: id });
  }

  uploadImg(id: any) {
    this.showUpload = true;
    this.carId = id;
    //this.navCtrl.setRoot(CarManualPage);
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
    this.http.post(this.global.url + 'upload-car-image/' + this.carId, { image: this.base64Image }, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((result: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        this.navCtrl.setRoot(CarPage);
      })
      .catch((error: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

  closeUpload() {
    this.showUpload = false;
  }

  deletCar(id: any) {
    this.showUpload = false;
    const alert = this.alertCtrl.create({
      title: this.translate.instant('sure'),
      message: this.translate.instant('sure-confirm-msg'),
      buttons: [
        {
          text: this.translate.instant('no')
        }, {
          text: this.translate.instant('yes'),
          cssClass: 'logout',
          handler: () => {
            this.deleteCarNow(id);
          }
        }
      ]
    });
    alert.present();
  }

  deleteCarNow(id: any) {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'car-delete/' + id, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((data: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        this.navCtrl.setRoot(CarPage);
      }).catch(error => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

}
