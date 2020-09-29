import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HeaderPage } from '../pages/header/header';
import { Global } from '../components/global';
import { DataResponse } from '../components/DataResponse';
import { PaginationResponse } from '../components/PaginationResponse';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { GoogleMaps } from '@ionic-native/google-maps';
import { LoginPage } from '../pages/login/login';
import { FieldErrorDisplayComponentPage } from '../pages/field-error-display-component/field-error-display-component';
import { ForgotPage } from '../pages/forgot/forgot';
import { RegisterPage } from '../pages/register/register';
import { WorkshopPage } from '../pages/workshop/workshop';
import { CategoryPage } from '../pages/category/category';
import { ActiveAccountPage } from '../pages/active-account/active-account';
import { RegsiterFormPage } from '../pages/regsiter-form/regsiter-form';
import { ValidatPage } from '../pages/validat/validat';
import { ResetCodePage } from '../pages/reset-code/reset-code';
import { ResetEmailPage } from '../pages/reset-email/reset-email';
import { ResetMobilePage } from '../pages/reset-mobile/reset-mobile';
import { ResetPassPage } from '../pages/reset-pass/reset-pass';
import { ChangePassPage } from '../pages/change-pass/change-pass';
import { Geolocation } from '@ionic-native/geolocation';
import { WorkshopDetailsPage } from '../pages/workshop-details/workshop-details';
import { CarPage } from '../pages/car/car';
import { CarAddPage } from '../pages/car-add/car-add';
import { CarManualPage } from '../pages/car-manual/car-manual';
import { CarScanPage } from '../pages/car-scan/car-scan';
import { Transfer } from '@ionic-native/transfer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileTransferObject } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { Camera } from '@ionic-native/camera'
import { CarHistoryPage } from '../pages/car-history/car-history';
import { WorkshopInfoPage } from '../pages/workshop-info/workshop-info';
import { HTTP } from '@ionic-native/http';
import { NotiPage } from '../pages/noti/noti';
import { CarInfoPage } from '../pages/car-info/car-info';
import { CustomerHistoryPage } from '../pages/customer-history/customer-history';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { FooterPage } from '../pages/footer/footer';
import { MainCatPage } from '../pages/main-cat/main-cat';
import { MainLoginPage } from '../pages/main-login/main-login';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { ListGaragePage } from '../pages/list-garage/list-garage';
import { ImageGallaryPage } from '../pages/image-gallary/image-gallary';
import { NgCalendarModule  } from 'ionic2-calendar'
import { NewCalenderPage } from '../pages/new-calender/new-calender';
import { Calendar } from '@ionic-native/calendar';
import { SearchFilterPage } from '../pages/search-filter/search-filter';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

export function setTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    HeaderPage,
    LoginPage,
    FieldErrorDisplayComponentPage,
    ForgotPage,
    RegisterPage,
    WorkshopPage,
    CategoryPage,
    ActiveAccountPage,
    RegsiterFormPage,
    ValidatPage,
    ResetCodePage,
    ResetEmailPage,
    ResetMobilePage,
    ResetPassPage,
    ChangePassPage,
    WorkshopDetailsPage,
    CarPage,
    CarAddPage,
    CarManualPage,
    CarScanPage,
    CarHistoryPage,
    WorkshopInfoPage,
    NotiPage,
    CarInfoPage,
    CustomerHistoryPage,
    FooterPage,
    MainCatPage,
    MainLoginPage,
    AboutUsPage,
    ContactUsPage,
    ListGaragePage,
    ImageGallaryPage,
    NewCalenderPage,
    SearchFilterPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (setTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgCalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    HeaderPage,
    LoginPage,
    FieldErrorDisplayComponentPage,
    ForgotPage,
    RegisterPage,
    WorkshopPage,
    CategoryPage,
    ActiveAccountPage,
    RegsiterFormPage,
    ValidatPage,
    ResetCodePage,
    ResetEmailPage,
    ResetMobilePage,
    ResetPassPage,
    ChangePassPage,
    WorkshopDetailsPage,
    CarPage,
    CarAddPage,
    CarManualPage,
    CarScanPage,
    CarHistoryPage,
    WorkshopInfoPage,
    NotiPage,
    CarInfoPage,
    CustomerHistoryPage,
    FooterPage,
    MainCatPage,
    MainLoginPage,
    AboutUsPage,
    ContactUsPage,
    ListGaragePage,
    ImageGallaryPage,
    NewCalenderPage,
    SearchFilterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Global,
    DataResponse,
    PaginationResponse,
    LocationTrackerProvider,
    GoogleMaps,
    Geolocation,
    FileChooser,
    IOSFilePicker,
    FileTransferObject,
    InAppBrowser,
    Transfer,
    Camera,
    AndroidFullScreen,
    HTTP,
    LaunchNavigator,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Calendar
  ]
})
export class AppModule { }
