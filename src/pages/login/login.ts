import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Global } from '../../components/global';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataResponse } from '../../components/DataResponse';
import { TranslateService } from '@ngx-translate/core';
import { ForgotPage } from '../forgot/forgot';
import { HomePage } from '../home/home';
import { NotiPage } from '../noti/noti';
import { ResetEmailPage } from '../reset-email/reset-email';
import { ValidatPage } from '../validat/validat';
import { RegsiterFormPage } from '../regsiter-form/regsiter-form';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  form: FormGroup;
  username: string;
  password: string;
  token: string;
  loginType: boolean = true;

  validation_messages = {
    'username': [
      { type: 'required', message: 'required' }
    ],
    'password': [
      { type: 'required', message: 'required' }
    ]
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient,
    public formBuilder: FormBuilder,
    public translate: TranslateService) {
      localStorage.setItem('footerPageName', '');
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      "has-error": this.isFieldValid(field),
      "has-feedback": this.isFieldValid(field)
    };
  }

  ionViewDidLoad() {
    if (localStorage.getItem('userType') == 'workshop') {
      this.loginType = false;
    } else {
      this.loginType = true;
    }
  }

  openForgot() {
    if (localStorage.getItem('sms') == 'Yes') {
      this.navCtrl.setRoot(ForgotPage);
    } else {
      this.navCtrl.setRoot(ResetEmailPage);
    }

  }

  openRegister() {
    this.navCtrl.setRoot(RegsiterFormPage);
  }

  login() {
    if (this.form.valid) {
      this.global.loadingSpinner();
      this.username = this.form.controls.username.value;
      this.password = this.form.controls.password.value;
      this.http
        .post(this.global.url + "login", {
          grant_type: "password",
          client_id: "4",
          client_secret: "nc0sdfBrF1a6wluFwJRdSaqDFNf4lrRf6IpbW9vg",
          username: this.username.toLowerCase(),
          password: this.password,
          device_token: localStorage.getItem('device_token'),
          scope: "*"
        })
        .toPromise()
        .then((data: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          if (data['success'] != null) {
            this.token = data.success["token"];
            localStorage.setItem('token', this.token);
            localStorage.setItem('name', data.success["name"]);
            if (data.success["image"] != '' && data.success["image"] != null) {
              localStorage.setItem('image', this.global.imagePath + data.success["image"]);
            } else {
              localStorage.setItem('image', '../assets/imgs/user.png');
            }
            if (data.success["type"] == 'admin' || data.success["type"] == 'customer') {
              localStorage.setItem('userType', 'customer');
              this.navCtrl.setRoot(HomePage);
            } else {
              localStorage.setItem('userType', 'workshop');
              this.navCtrl.setRoot(NotiPage);
            }

          } else {
            this.global.alertMsg('error', 'need_activation');
            this.navCtrl.setRoot(ValidatPage, { email: this.form.controls.username.value });
          }
        })
        .catch(error => {
          this.global.customLoading.dismiss();
          console.log(error)
          this.global.alertMsg('error', 'login_error');
        });
    }
  }

  goBack() {
    this.navCtrl.setRoot(HomePage)
  }

}
