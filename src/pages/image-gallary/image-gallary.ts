import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Global } from '../../components/global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NotiPage } from '../noti/noti';
import { DataResponse } from '../../components/DataResponse';
import { PaginationResponse } from '../../components/PaginationResponse';

/**
 * Generated class for the ImageGallaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-image-gallary',
  templateUrl: 'image-gallary.html',
})
export class ImageGallaryPage {
  status: boolean = false;
  divId: any;
  showUpload: boolean = false;
  base64Image: any;
  nextPage = 1;
  dataContent: any = [];
  viewData: any = [];
  maxPage = 1;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient,
    public translate: TranslateService,
    public camera: Camera,
    public alertCtrl: AlertController, ) {
      localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() {
    this.load();
  }

  goBack() {
    this.navCtrl.setRoot(NotiPage);
  }

  load() {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'workshop-image-list?page=' + this.nextPage, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((result: PaginationResponse<any>) => {
        console.log(result);
        this.global.customLoading.dismiss();
        if (result.error == 'success') {
          this.dataContent = result.data.data;
          this.maxPage = result.last_page;
          for (var i = 0; i < this.dataContent.length; i++) {
            this.viewData.push(this.dataContent[i]);
          }
          console.log(this.viewData);
          this.nextPage++;
        } else {
          this.global.alertMsg('error', 'server_400');
        }
      }).catch(error => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

  doInfinite(infiniteScroll: any) {
    if (this.nextPage <= this.maxPage) {
      return this.load();
    } else {
      infiniteScroll.complete();
    }
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

  uploadImg() {
    this.showUpload = true;
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
    this.http.post(this.global.url + 'upload-workshop-image', { image: this.base64Image }, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((result: PaginationResponse<any>) => {
        this.global.customLoading.dismiss();
        this.navCtrl.setRoot(ImageGallaryPage);
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

  deletImage(id: any) {
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
            this.deleteImageNow(id);
          }
        }
      ]
    });
    alert.present();
  }

  deleteImageNow(id: any) {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'workshop-delete-image/' + id, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((data: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        this.navCtrl.setRoot(ImageGallaryPage)
      }).catch(error => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

}
