import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Global } from '../../components/global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CarPage } from '../car/car';
import { DataResponse } from '../../components/DataResponse';

/**
 * Generated class for the CarManualPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-car-manual',
  templateUrl: 'car-manual.html',
})
export class CarManualPage {
  brand: any = [];
  carModel: any = [];
  statList: any = [];
  modelList: any = [];
  form: FormGroup;
  viewForms: boolean = false;
  viewBrand: boolean = false;

  validation_messages = {
    'model': [
      { type: 'required', message: 'required' }
    ],
    'origin': [
      { type: 'required', message: 'required' }
    ],
    'vehicle_type': [
      { type: 'required', message: 'required' }
    ],
    'city_id':[
      { type: 'required', message: 'required' }
    ],
    'code':[
      { type: 'required', message: 'required' }
    ],
    'number':[
      { type: 'required', message: 'required' }
    ]
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient,
    public formBuilder: FormBuilder,
    public translate: TranslateService) {
      localStorage.setItem('footerPageName', 'car');
  }

  ionViewDidLoad() {
    this.load();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      model: [null, Validators.required],
      origin: [null, Validators.required],
      vehicle_type: [null, Validators.required],
      city_id: [null, Validators.required],
      code: [null, Validators.required],
      number: [null, Validators.required]
    });
  }

  goBack() {
    this.navCtrl.setRoot(CarPage)
  }

  load() {
    this.viewBrand = true;
    console.log(this.viewBrand);
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'brand', {
      headers: this.global.noheader
    })
      .toPromise()
      .then((result: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        if (result.error == 'success') {
          this.brand = result.data[0];
          this.statList = result.data[1];
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

  // createModelList(){
  //   var year = new Date()
  //   for(var i=1990; i>year.getFullYear(); i++){
  //     this.modelList[i]=i
  //   }
  // }

  setBrand(item: any) {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'car_model/' + item, {
      headers: this.global.noheader
    })
      .toPromise()
      .then((result: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        if (result.error == 'success') {
          this.viewBrand = false;
          this.viewForms = true;
          this.modelList=result.data[3];
          this.carModel = result.data[0];
          this.form.controls.origin.setValue(result.data[1].country);
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

  save() {
    if (this.form.valid) {
      this.global.loadingSpinner();
      this.http.post(this.global.url + 'car-add', this.form.value, { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
        .toPromise()
        .then((data: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          if (data.error == 'bad_request') {
            this.global.alertMsg('error', 'server_error');
          } else if (data.error == 'success') {
            this.global.alertMsg('success', 'data_save');
            this.navCtrl.setRoot(CarPage);
          }
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
