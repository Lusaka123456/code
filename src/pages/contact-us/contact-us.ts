import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Global } from '../../components/global';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { DataResponse } from '../../components/DataResponse';


/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  form: FormGroup;
  isSent: boolean = false;

  validation_messages = {
    'name': [
      { type: 'required', message: 'required' },
      { type: 'minlength', message: 'minlength8' },
      { type: 'maxlength', message: 'maxlength200' },
      { type: 'pattern', message: 'pattern_text' }
    ],
    'mobile': [
      { type: 'required', message: 'required' },
      { type: 'pattern', message: 'pattern_mobile' },
    ],
    'email': [
      { type: 'required', message: 'required' },
      { type: 'pattern', message: 'pattern_email' }
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
      name: [null, Validators.compose([
        Validators.required,
        Validators.pattern("([a-zA-Z|\u0600-\u06FF|0-9])([a-zA-Z|\u0600-\u06FF|0-9| /s ]*)$"),
        Validators.minLength(5),
        Validators.maxLength(200)
      ])],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
        ])
      ],
      mobile: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('[5-5][0|2|4|5|6|8][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
        ])
      ]
    });
  }

  ionViewDidLoad() {

  }

  goBack() {
    this.navCtrl.setRoot(HomePage);
  }

  save() {
    if (this.form.valid) {
      this.global.loadingSpinner();
      this.http.post(this.global.url + 'mobGetInTech', this.form.value)
        .toPromise()
        .then((data: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          this.global.alertMsg('success', 'thanks');
          this.isSent = true;
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
}
