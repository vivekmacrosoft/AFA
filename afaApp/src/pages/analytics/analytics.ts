import { Component } from '@angular/core';
import {LoginPage} from '../login/login';
import {CookieService} from 'ngx-cookie-service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AnalyticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-analytics',
  templateUrl: 'analytics.html',
})
export class AnalyticsPage {
  deviceName:string;
  deviceId:any;

  constructor(public cookieService: CookieService, public navCtrl: NavController, public navParams: NavParams) {
    this.deviceName=this.cookieService.get('deviceName');
    console.log(this.deviceName);
    this.deviceId=this.cookieService.get('deviceId');
    console.log(this.deviceId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnalyticsPage');
  }

  goBack()
  {
    this.navCtrl.setRoot('HomePage');
  }

  goTable()
  {
    this.navCtrl.setRoot('TablePage')
  }

  goBar(){
    this.navCtrl.setRoot('BarPage');
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage);
    this.cookieService.delete('xAuthToken'); 
  }

}
