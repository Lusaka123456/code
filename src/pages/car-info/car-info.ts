import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NotiPage } from '../noti/noti';
import { Global } from '../../components/global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataResponse } from '../../components/DataResponse';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

/**
 * Generated class for the CarInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-car-info',
  templateUrl: 'car-info.html',
})
export class CarInfoPage {
  notiId: any;
  carInfo: any = [];
  carHistory: any = [];
  userInfo: any = [];
  notiInfo: any = [];
  viewData: boolean = false;
  history: boolean = false;
  information: boolean = false;
  fullBG: boolean = false;
  form: FormGroup;
  viewUserComment: boolean = false;
  userComment: any = [];

  validation_messages = {
    'request_time': [
      { type: 'required', message: 'required' }
    ],
    'request_date': [
      { type: 'required', message: 'required' }
    ]
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient,
    public formBuilder: FormBuilder) {
    this.notiId = navParams.get('id');
    localStorage.setItem('footerPageName', '');
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      request_time: [null, Validators.required],
      request_date: [null, Validators.required]
    });
  }

  ionViewDidLoad() {
    this.load();
  }

  goBack() {
    this.navCtrl.setRoot(NotiPage)
  }

  load() {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'openNotiCarDetails/' + this.notiId,
      {
        headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") })
      })
      .toPromise()
      .then((result: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        if (result.error == 'success') {
          this.viewData = true;
          this.information = true;
          this.userInfo = result.data.userInfo;
          this.carInfo = result.data.carInfo;
          this.carHistory = result.data.carHistory;
          this.notiInfo = result.data.notiInfo;
          this.userComment = result.data.userComment;
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

  changeView(tab: any) {
    if (tab == 'info') {
      this.information = true;
      this.history = false;
    } else if (tab == 'history') {
      this.history = true;
      this.information = false;
    }
  }

  reject() {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'rejectRequest/' + this.notiId,
      {
        headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") })
      })
      .toPromise()
      .then((result: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        if (result.error == 'success') {
          this.global.alertMsg('success', 'data_save');
          this.goBack();
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

  openContent() {
    this.fullBG = true;
  }

  closeFaseBox() {
    this.fullBG = false;
  }

  accept() {
    this.openContent()
  }

  save() {
    if (this.form.valid) {
      this.global.loadingSpinner();
      this.http.post(this.global.url + 'acceptRequest/' + this.notiId, this.form.value, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
        .toPromise()
        .then((data: DataResponse<any>) => {

          this.global.customLoading.dismiss();
          this.global.alertMsg('success', 'data_save');
          this.goBack();
        })
        .catch(error => {
          this.global.customLoading.dismiss();
          console.log(error)
          this.global.alertMsg('error', 'server_error');
        });
    } else {
      this.global.validateAllFormFields(this.form);
    }
  }

  openCommentsPage() {
    this.viewUserComment = true;
  }

  closeFaseBoxComment() {
    this.viewUserComment = false;
  }

}
