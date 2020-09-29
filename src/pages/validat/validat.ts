import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Global } from '../../components/global';
import { HttpClient } from '@angular/common/http';
import { DataResponse } from '../../components/DataResponse';

/**
 * Generated class for the ValidatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-validat',
  templateUrl: 'validat.html',
})
export class ValidatPage {
  mobile: any;
  email: any;
  mobileCode: any;
  emailCode: string='';
  isValid: boolean = false;
  sms: any = ''

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient) {
    this.mobile = navParams.get('mobile');
    this.email = navParams.get('email');
    localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() {
    this.sms = localStorage.getItem('sms')
  }

  goBack() {
    this.navCtrl.setRoot(LoginPage)
  }

  validatMobile() {
    if (this.mobileCode != '') {
      this.global.loadingSpinner();
      this.http.post(this.global.url + 'valid-mob', { code: this.mobileCode, mobile: this.mobile })
        .toPromise()
        .then((data: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          if (data['success'] != null) {
            this.global.alertMsg('success', 'Account activated success');
            this.navCtrl.setRoot(LoginPage);
          } else {
            this.global.alertMsg('error', 'wrong_code');
          }
        })
        .catch(error => {
          this.global.customLoading.dismiss();
          console.log(error)
          this.global.alertMsg('error', 'server_error');
        });
    } else {
      this.global.alertMsg('error', 'code_empty');
    }
  }

  validatEmail() {
    if (this.emailCode != '') {
      this.global.loadingSpinner();
      this.http.post(this.global.url + 'valid-email', { code: this.emailCode, email: this.email })
        .toPromise()
        .then((data: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          if (data['success'] == 'user_active') {
            this.global.alertMsg('success', 'account_activation');
            this.navCtrl.setRoot(LoginPage);
          } else if (data['success'] == 'code_sent') {
            this.global.alertMsg('error', 'wrong_code_check');
          } else {
            this.global.alertMsg('error', 'wrong_code');
          }
        })
        .catch(error => {
          this.global.customLoading.dismiss();
          console.log(error)
          this.global.alertMsg('error', 'server_error');
        });
    } else {
      this.global.alertMsg('error', 'code_empty');
    }
  }

  resendCode() {
    this.http.get(this.global.url + 'valid-email?email=' + this.email)
      .toPromise()
      .then((data: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        if (data['success'] != null) {
          this.global.alertMsg('success', 'code_resent');
        } else {
          this.global.alertMsg('error', 'wrong_code');
        }
      })
      .catch(error => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

  next(e: any, inputId:any){
    if(inputId=='finish'){
      this.emailCode+=e.key
      this.validatEmail();
    }else{
      inputId.focus();
      this.emailCode+=e.key
    }
  }

}
