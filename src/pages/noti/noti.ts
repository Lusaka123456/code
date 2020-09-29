import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Global } from '../../components/global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PaginationResponse } from '../../components/PaginationResponse';
import { DataResponse } from '../../components/DataResponse';
import { CarInfoPage } from '../car-info/car-info';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainCatPage } from '../main-cat/main-cat';
import { CustomerHistoryPage } from '../customer-history/customer-history';
import { Calendar } from '@ionic-native/calendar';

/**
 * Generated class for the NotiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// declare var $;

@Component({
  selector: 'page-noti',
  templateUrl: 'noti.html',
})
export class NotiPage {
  dataContent: any = [];
  viewData: any = [];
  nextPage = 1;
  maxPage = 1;
  userType: any;
  fullBG: boolean = false;
  rateComments: boolean = false;
  form: FormGroup;
  notiId: any = ''
  rateStar = 0;

  validation_messages = {
    'rate': [
      { type: 'required', message: 'required' }
    ],
    'comments': [
      { type: 'required', message: 'required' }
    ]
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient,
    public formBuilder: FormBuilder,
    private calendar: Calendar) {
    localStorage.setItem('pageTitle', 'notifications');
    localStorage.setItem('footerPageName', 'home');
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      rate: [null, Validators.required],
      comments: [null, Validators.required]
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
    this.userType = localStorage.getItem('userType')
    localStorage.setItem('notiCount', '');
    localStorage.removeItem('notiCount');
    this.load();
  }

  load() {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'openNotiPage',
      {
        headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") })
      })
      .toPromise()
      .then((result: PaginationResponse<any>) => {
        this.global.customLoading.dismiss();
        if (result.error == 'success') {
          this.dataContent = result.data.data;
          this.maxPage = result.last_page;
          for (var i = 0; i < this.dataContent.length; i++) {
            this.viewData.push(this.dataContent[i]);
            if (this.dataContent[i].status == 'new' && this.dataContent[i].noti_text == 'accept') {
              this.addToNativCalender(this.dataContent[i]);
            }
          }

          this.nextPage++;
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

  addToNativCalender(eventData: any) {
    let date = new Date(eventData.request_date+' '+eventData.request_time+':00');
    let options = { firstReminderMinutes: 30, calendarColor: '#dc713d' };
    let title=''
    let garageName ='';
    if(this.global.lang=='ar'){
      title='موعد سيارتك';
      garageName = eventData.ar_name;
    }else{
      title='Car appointment';
      garageName = eventData.en_name;
    }

    this.calendar.createEventInteractivelyWithOptions(title, '', garageName, date, date, options)
    .then(res => {
    }, err => {
    });
  }

  goBack() {
    this.navCtrl.setRoot(NotiPage)
  }

  doInfinite(infiniteScroll: any) {
    if (this.nextPage <= this.maxPage) {
      return this.load();
    } else {
      infiniteScroll.complete();
    }
  }

  openNotiDetails(notiId: any) {
    if (localStorage.getItem('userType') == 'workshop') {
      this.navCtrl.setRoot(CarInfoPage, { id: notiId });
    } else {
      let notiInfo = this.viewData.filter(item => item.id == notiId)
      if (notiInfo[0]['noti_text'] == 'accept' || notiInfo[0]['noti_text'] == 'reject') {

      } else if (notiInfo[0]['noti_text'] == 'finish') {

      }
    }
  }

  openCommentsRate(notiId: any) {
    this.fullBG = true;
    this.rateComments = true;
    this.notiId = notiId;
  }

  closeFaseBox() {
    this.fullBG = false;
    this.rateComments = false;
  }

  saveRateComments() {
    if (this.form.valid) {
      this.global.loadingSpinner();
      this.http.post(this.global.url + 'saveRateComments/' + this.notiId, this.form.value,
        { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
        .toPromise()
        .then((data: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          this.navCtrl.setRoot(NotiPage);
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

  setRateValue(value: any) {
    this.rateStar = value;
    this.form.controls.rate.setValue(value)
    this.form.controls.rate.updateValueAndValidity();
  }

  startNewSearch() {
    this.navCtrl.setRoot(MainCatPage);
  }

  goToBooking() {
    this.navCtrl.setRoot(CustomerHistoryPage)
  }

}
