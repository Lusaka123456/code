import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CarManualPage } from '../car-manual/car-manual';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Global } from '../../components/global';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DataResponse } from '../../components/DataResponse';

/**
 * Generated class for the CarAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-car-add',
  templateUrl: 'car-add.html',
})
export class CarAddPage {
  showUpload: boolean =false;
  base64Image: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public http: HttpClient,
    public global: Global,
    public camera: Camera) {
      localStorage.setItem('footerPageName', 'car');
  }

  ionViewDidLoad() {
    
  }

  openCarScan(){
    this.showUpload=true;
  }

  openCarManual(){
    this.navCtrl.setRoot(CarManualPage);
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
    this.http.post(this.global.url + 'car-scan', { image: this.base64Image }, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((result: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        localStorage.setItem('image', this.global.imagePath + result.data);
        //this.navCtrl.setRoot(HomePage);
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

}
