import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CookieService} from 'ngx-cookie-service';
import {LoginPage} from '../login/login';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  KnobValues:any;
  constructor(private alertCtrl: AlertController,private cookieService: CookieService,public navCtrl: NavController, public navParams: NavParams) {

  this.KnobValues = {
    upper:null,
    lower:null
  };
  
  this.KnobValues.upper = this.cookieService.get('Max');
  this.KnobValues.lower = this.cookieService.get('Min');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

  saveLimits()
  {
    this.cookieService.set('Min',this.KnobValues.lower);
    this.cookieService.set('Max',this.KnobValues.upper);
    this.showLimitsAlert();
  }

  resetLimits()
  {
    this.KnobValues = {
      upper:55,
      lower:36
    }
    this.cookieService.set('Min',this.KnobValues.lower);
    this.cookieService.set('Max',this.KnobValues.upper);
    this.showResetAlert();  
  }

  showLimitsAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'Limits saved!',
      buttons: ['Ok']
    });
    alert.present();
  }

  showResetAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'Limits set to default successfully!',
      buttons: ['Ok']
    });
    alert.present();
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage); 
    this.cookieService.delete('xAuthToken'); 
  }
}
