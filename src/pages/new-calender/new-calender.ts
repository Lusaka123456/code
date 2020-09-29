import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Global } from '../../components/global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataResponse } from '../../components/DataResponse';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


/**
 * Generated class for the NewCalenderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-calender',
  templateUrl: 'new-calender.html',
})
export class NewCalenderPage implements OnInit {
  eventSource = [];
  calendar = {
    mode: 'day',
    currentDate: new Date()
  }
  event = {
    id: '',
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  }
  minDate = new Date().toISOString();
  viewDate = [];
  viewCustomerCard: boolean = false;
  customerCard=[];

  fullBG: boolean = false;
  form: FormGroup;
  calenderId: any;

  validation_messages = {
    'what_repaired': [
      { type: 'required', message: 'required' }
    ],
    'customer_comment': [
      { type: 'required', message: 'required' }
    ]
  };

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: HttpClient,
    public formBuilder: FormBuilder) {
      localStorage.setItem('footerPageName', 'calendar');
  }

  goBack() {
    this.navCtrl.setRoot(HomePage)
  }

  ngOnInit() {
    this.load();
    this.form = this.formBuilder.group({
      what_repaired: [null, Validators.required],
      customer_comment: [null, null]
    });
  }

  resetEvent() {
    this.event = {
      id: '',
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }

  load() {
    this.global.loadingSpinner();
    this.http.get(this.global.url + 'viewCalenderDate',
      { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) })
      .toPromise()
      .then((result: DataResponse<any>) => {
        if (result.error == 'success') {
          this.viewDate = result.data;
          for (let i = 0; i < this.viewDate.length; i++) {
            let eventCopy = {
              id: this.viewDate[i].id,
              title: this.viewDate[i].title,
              desc: this.viewDate[i].desc,
              startTime: new Date(this.viewDate[i].startTime),
              endTime: new Date(this.viewDate[i].endTime),
              allDay: false
            }
            this.eventSource.push(eventCopy);
            this.myCal.loadEvents();
            this.resetEvent();
          }
        }
        this.global.customLoading.dismiss();
      })
      .catch((error: DataResponse<any>) => {
        this.global.customLoading.dismiss();
        console.log(error)
        this.global.alertMsg('error', 'server_error');
      });
  }

  next() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  back() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  // Change between month/week/day
  changeMode(mode) {
    this.calendar.mode = mode;
  }

  // Focus today
  today() {
    this.calendar.currentDate = new Date();
  }

  async onEventSelected(event: any) {
    console.log(event.id);
    this.customerCard=this.viewDate.filter(item => item.id == event.id);
    console.log(this.customerCard);
    this.viewCustomerCard =true;
  }

  finish(id: any){
    this.fullBG = true;
    this.calenderId=id;
    this.viewCustomerCard = false;
  }

  closeFaseBox() {
    this.viewCustomerCard = false;
    this.fullBG = false;
  }

  save() {
    if (this.form.valid) {
      this.global.loadingSpinner();
      this.http.post(this.global.url + 'saveFeedback/'+this.calenderId,
      this.form.value,
        { headers: new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") }) }
      ).toPromise()
        .then((result: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          this.navCtrl.setRoot(NewCalenderPage);
          this.global.alertMsg('success', 'data_save');
          this.closeFaseBox();
        })
        .catch((error: DataResponse<any>) => {
          this.global.customLoading.dismiss();
          console.log(error)
          this.global.alertMsg('error', 'server_error');
        });
    } else {
      this.global.validateAllFormFields(this.form);
    }
  }

}
