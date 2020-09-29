import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ForgotPage } from '../forgot/forgot';
import { Global } from '../../components/global';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DataResponse } from '../../components/DataResponse';
import { ResetCodePage } from '../reset-code/reset-code';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ResetEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reset-email',
  templateUrl: 'reset-email.html',
})
export class ResetEmailPage {
  form: FormGroup;

  validation_messages = {
    'email': [
      { type: 'required', message: 'required' },
      { type: 'pattern', message: 'pattern_email' }
    ]
  };

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
        ])
      ]
    });
  }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient,
    public formBuilder: FormBuilder,
    public translate: TranslateService) {
      localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() {
    
  }

  goBack(){
    if(localStorage.getItem('sms')=='Yes'){
      this.navCtrl.setRoot(ForgotPage);
    }else{
      this.navCtrl.setRoot(LoginPage);
    }
  }

  sendCode(){
    if(this.form.valid){
      this.global.loadingSpinner();
      this.http.post(this.global.url+'reset-email', this.form.value)
      .toPromise()
      .then((data: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        if(data.error=='code_sent'){
          this.navCtrl.setRoot(ResetCodePage, {item: this.form.controls.email.value, type: 'email'});
        }else{
          this.global.alertMsg('error', 'email_not_found');
        }
      })
      .catch(error => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
    }else{
      this.global.validateAllFormFields(this.form);
    }
  }

}
