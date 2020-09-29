import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WorkshopPage } from '../workshop/workshop';

/**
 * Generated class for the SearchFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-filter',
  templateUrl: 'search-filter.html',
})
export class SearchFilterPage {
  showInput: boolean = false;
  showFilte: boolean = false;
  searchByName: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
  }

  openSearch(){
    if(this.showInput){
      this.showInput=false;
      this.showFilte=false;
    }else{
      this.showInput=true;
    }
  }

  openFilter(){
    if(this.showFilte){
      this.showFilte=false;
    }else{
      this.showFilte=true;
    }
  }

  search(event) {
    if (event && event.key === "Enter") { 
    if (this.searchByName != null) {
      this.navCtrl.setRoot(WorkshopPage, { search: this.searchByName });
    }
  }
  }

  searchWithFilter(sort: any){
    this.navCtrl.setRoot(WorkshopPage, { search: this.searchByName, filter:  sort});
  }

}
