import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {HttpClientModule} from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { LoginService } from '../services/login.service';
import { DeviceService } from '../services/device.service';
import { IonicStorageModule } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Util } from '../constants/util';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ExceptionService } from '../services/exception.service';
import { GatewayService } from '../services/gateway.service';
import { UtilityService } from '../services/utility.service';



@NgModule({
  declarations: [
    MyApp,
    LoginPage
  ],
  imports: [
    AngularFontAwesomeModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage
  ],
  providers: [
    Util,
    CookieService,
    LoginService,
    DeviceService,
    LoadingController,
    ExceptionService,
    GatewayService,
    UtilityService,
    LocalNotifications,
    DatePipe,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
