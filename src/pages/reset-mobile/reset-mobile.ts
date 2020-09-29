import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ForgotPage } from '../forgot/forgot';
import { Global } from '../../components/global';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DataResponse } from '../../components/DataResponse';
import { ResetCodePage } from '../reset-code/reset-code';

/**
 * Generated class for the ResetMobilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reset-mobile',
  templateUrl: 'reset-mobile.html',
})
export class ResetMobilePage {
  form: FormGroup;

  validation_messages = {
    'mobile': [
      { type: 'required', message: 'required' }
    ]
  };

  ngOnInit() {
    this.form = this.formBuilder.group({
      mobile: [
        null,Validators.required
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
    this.navCtrl.setRoot(ForgotPage)
  }

  sendCode(){
    if(this.form.valid){
      this.global.loadingSpinner();
      this.http.post(this.global.url+'reset-mobile', this.form.value)
      .toPromise()
      .then((data: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        if(data.error=='code_sent'){
          this.navCtrl.setRoot(ResetCodePage, {item: this.form.controls.mobile.value, type: 'mobile'});
        }else{
          this.global.alertMsg('error', 'mobile_not_found');
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
