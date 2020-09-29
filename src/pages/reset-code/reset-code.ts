import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ForgotPage } from '../forgot/forgot';
import { Global } from '../../components/global';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { DataResponse } from '../../components/DataResponse';
import { ResetPassPage } from '../reset-pass/reset-pass';

/**
 * Generated class for the ResetCodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reset-code',
  templateUrl: 'reset-code.html',
})
export class ResetCodePage {
  item: string = '';
  type: string = '';
  code: string = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient,
    public translate: TranslateService) {
    this.item = navParams.get('item');
    this.type = navParams.get('type');
    localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() { }

  goBack(){
    this.navCtrl.setRoot(ForgotPage)
  }

  checkCode(){
    if(this.code!=null){
      this.global.loadingSpinner();
      this.http.post(this.global.url+'reset-check', {code: this.code, item: this.item, type: this.type})
      .toPromise()
      .then((data: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        if(data.error=='success'){
          this.navCtrl.setRoot(ResetPassPage, {user_id: data.user_id})
        }else{
          this.global.alertMsg('error', 'check_code');
        }
      })
      .catch(error => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
    }
  }


}
