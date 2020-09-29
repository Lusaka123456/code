import { NavController, NavParams } from 'ionic-angular';
import { Component, Input } from '@angular/core';
/**
 * Generated class for the FieldErrorDisplayComponentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-field-error-display-component',
  templateUrl: 'field-error-display-component.html'})
export class FieldErrorDisplayComponentPage {
  @Input() errorMsg: string;
  @Input() displayError: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
  }

}

 
