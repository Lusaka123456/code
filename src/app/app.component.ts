import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = HomePage;
  public onlineOffline: boolean = navigator.onLine;
  constructor(platform: Platform,
    statusBar: StatusBar,
    private androidFullScreen: AndroidFullScreen,
    splashScreen: SplashScreen,
    translate: TranslateService
  ) {
    translate.setDefaultLang('en');
    platform.ready().then(() => {
      if(platform.is("ios")){
      (<any>window).FirebasePlugin.grantPermission();
      }
      // if(platform.is("android")){
      //   platform.registerBackButtonAction(() => {
      //     const alert = this.alertCtrl.create({
      //       title: translate.instant('exit'),
      //       message: translate.instant('exit-confirm-msg'),
      //       buttons: [
      //         {
      //           text: translate.instant('close')
      //         }, {
      //           text: translate.instant('exit'),
      //           cssClass: 'logout',
      //           handler: () => {
      //             platform.exitApp();
      //           }
      //         }
      //       ]
      //     });
      //     alert.present();
      //   }, 1);
      // }
      statusBar.hide();
      splashScreen.hide();
      this.androidFullScreen.isImmersiveModeSupported()
        .then(() => {
          this.androidFullScreen;
          this.androidFullScreen.immersiveMode();

        })
        .catch(err => console.log(err));
    });
  }
}

