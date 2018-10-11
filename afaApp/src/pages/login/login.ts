import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {UserLogin} from '../../model/UserLogin';
import {LoginService} from '../../services/login.service';
import { ExceptionService } from '../../services/exception.service';
import {AlertController} from 'ionic-angular';
import {ToastController} from 'ionic-angular';
import {CookieService} from 'ngx-cookie-service';
import {Platform} from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {


  account: UserLogin;
  accountClient: UserLogin;
  stayLoggedIn: boolean;
  showForgotPassword: boolean;
  touchIdAvail: boolean;
  constructor(public plt: Platform, private cookieService: CookieService, private toastCtrl: ToastController, private alertCtrl: AlertController, private loginService: LoginService,  private exceptionService: ExceptionService,public navCtrl: NavController, public navParams: NavParams) {

    console.log(this.plt);
    this.accountClient = {
      username: '',
      password: ''
    }
    this.account = {
      username: 'mats_samuelsson',
      password: '9TG5k57Z'
    }
    this.showForgotPassword = false;

    if (this.cookieService.get('stayLoggedIn')) {
      var stayLogged = this.cookieService.get('stayLoggedIn');

      if (stayLogged == "true") {
        this.stayLoggedIn = true;
        if (this.cookieService.get('username') !== null && this.cookieService.get('password') !== null) {
          this.accountClient.username = this.cookieService.get('username');
          this.accountClient.password = this.cookieService.get('password');
        }
      }
      else {
        this.stayLoggedIn = false;
        this.accountClient.username = '';
        this.accountClient.password = '';
      }
    }
    else {
      this.stayLoggedIn = false;
      this.accountClient.username = '';
      this.accountClient.password = '';
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  presentAlert() {
    var title= 'Login';
    var subTitle= 'Username and password are required for login';
    this.exceptionService.errorMessage(title,subTitle);
    
  }

  presentFailedAlert() {
    var title= 'Invalid Login';
    var subTitle= 'Please enter correct username and password';
    this.exceptionService.errorMessage(title,subTitle);
    
  }

  presentFailedAlertTouchID() {
    var title= 'Invalid Login';
    var subTitle= 'Username and password are required for using touch-id/face-id for the first time';
    this.exceptionService.errorMessage(title,subTitle);
    
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Logged in successfully',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  doLogin() {
    if (this.stayLoggedIn == true) {
      this.cookieService.set('username', this.accountClient.username);
      this.cookieService.set('password', this.accountClient.password);
    }
    
    if (this.accountClient.username == '' || this.accountClient.password == '') {
      this.presentAlert();
      return;
    }
    // if (this.accountClient.username == 'AFA' && this.accountClient.password == 'afa2018') {
      this.loginService.login(this.accountClient).subscribe((data: any) => {
        console.log(data);
        if (data && data.token) {
          this.cookieService.set('xAuthToken', data.token);
          this.presentToast();
          this.navCtrl.setRoot('HomePage');
        }

        else if(data == "Wrong password"){

          var title= 'Wrong Credentials!';
          var subTitle= 'Please make re-check your credentials';
          this.exceptionService.errorMessage(title,subTitle);
          
        }

        else{
          this.showError();
        }
      },
        err => {
          console.log(err);
          if (err.error.error == "Invalid login attempt") {

            this.presentFailedAlert();
          }
          else {
            this.showError();
          }

        })
    // }
    // else {

    //   this.presentFailedAlert();
    //   return;
    // }
  }

  showError() {
    let alert = this.alertCtrl.create({
      title: 'Internet connection lost!',
      subTitle: 'Please make sure that you are connected to the internet.',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  stayLogged(value) {
    if (value == true) {
      this.cookieService.set('stayLoggedIn', "true");
      this.cookieService.set('username', this.accountClient.username);
      this.cookieService.set('password', this.accountClient.password);
    }
    else {
      this.cookieService.set('stayLoggedIn', "false");
      this.cookieService.delete('username');
      this.cookieService.delete('password');
    }
  }

  openPage(p) {
    this.navCtrl.push(p);
  }

  showForgot() {
    this.showForgotPassword = !this.showForgotPassword;
  }

  showForgotPasswordSuccess() {
    let alert = this.alertCtrl.create({
      title: 'Password reset email sent successfully!',
      subTitle: 'Please check email associated to your username.',
      buttons: ['Dismiss']
    });
    alert.present();

  }

  showForgotPasswordFailure() {
    let alert = this.alertCtrl.create({
      title: 'Some problem occoured!',
      subTitle: 'Some problem occoured while resetting password.',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  // doForgotPassword() {
  //   var username = {
  //     Username: this.accountClient.username
  //   };
  //   this.loginService.forgotPassword(username).subscribe((data: any) => {
  //     console.log(data);
  //     if (data.response == true) {
  //       this.showForgotPasswordSuccess();
  //     }
  //     else {
  //       this.showForgotPasswordFailure();
  //     }
  //   }, err => {
  //     this.showError();
  //   })

  // }
}