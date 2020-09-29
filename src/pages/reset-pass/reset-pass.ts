import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Global } from '../../components/global';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import { DataResponse } from '../../components/DataResponse';

/**
 * Generated class for the ResetPassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reset-pass',
  templateUrl: 'reset-pass.html',
})
export class ResetPassPage {
  form: FormGroup;
  user_id: string='';

  validation_messages = {
    'password': [
      { type: 'required', message: 'required' },
      { type: 'minlength', message: 'minlength8' },
      { type: 'pattern', message: 'strong_password' }
    ],
    con_password: [
      { type: 'required', message: 'required' }
    ]
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient,
    public formBuilder: FormBuilder,
    public translate: TranslateService) {
      this.user_id=navParams.get('user_id');
      localStorage.setItem('footerPageName', '');
  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({

      password: [
        null,
        Validators.compose([Validators.required,
        Validators.minLength(8),
        Validators.pattern("(?=^.{8,}$)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$")])
      ],
      con_password: [null, Validators.required]
    });
  }

  goBack() {
    this.navCtrl.setRoot(LoginPage)
  }

  save() {
    if (this.form.valid) {
      if(this.form.controls.password.value==this.form.controls.con_password.value){
        this.global.loadingSpinner();
        this.http.post(this.global.url+'reset-pass', {user_id: this.user_id, password: this.form.controls.password.value})
        .toPromise()
        .then((data: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          this.global.alertMsg('success', 'new_pass_saved');
          this.navCtrl.setRoot(LoginPage);
        })
        .catch(error => {
          this.global.customLoading.dismiss();
          console.log(error)
          this.global.alertMsg('error', 'server_error');
        });
      }else{
        this.global.alertMsg('error', 'pass_con_pass');
        this.form.controls.con_password.setValue('');
      }
    } else {
      this.global.validateAllFormFields(this.form);
    }
  }

}
