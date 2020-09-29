import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Global } from '../../components/global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../home/home';
import { DataResponse } from '../../components/DataResponse';

/**
 * Generated class for the ChangePassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-change-pass',
  templateUrl: 'change-pass.html',
})
export class ChangePassPage {
  form: FormGroup;
  validation_messages = {
    'old_password':[
      { type: 'required', message: 'required' }
    ],
    'password': [
      { type: 'required', message: 'required' },
      { type: 'minlength', message: 'minlength8' },
      { type: 'pattern', message: 'strong_password' }
    ],
    'con_password': [
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

  ionViewDidLoad() {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      old_password: [null, Validators.required],
      password: [
        null,
        Validators.compose([Validators.required,
        Validators.minLength(8),
        Validators.pattern("(?=^.{8,}$)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$")])
      ],
      con_password: [null, Validators.required]
    });
  }

  goBack(){
    this.navCtrl.setRoot(HomePage);
  }

  save(){
    if(this.form.valid){
      if(this.form.controls.password.value==this.form.controls.con_password.value){
        this.global.loadingSpinner();
        this.http.post(this.global.url+'change-pass', this.form.value,{ headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
        .toPromise()
        .then((data: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          if(data.error=='success'){
            this.navCtrl.setRoot(HomePage);
            this.global.alertMsg('success', 'new_pass_saved');
          }else{
            this.global.alertMsg('error', 'old_pass_error');
          }
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
    }else{
      this.global.validateAllFormFields(this.form);
    }
  }

}
