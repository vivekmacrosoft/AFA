import { AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { Injectable } from '@angular/core';
import { Component, ViewChild } from '@angular/core';


@Injectable()
export class ExceptionService {
    @ViewChild('myNav') nav: NavController
    constructor(private alertCtrl: AlertController) {

    }

    errorMessage(title, subtitle) {
        let alert = this.alertCtrl.create({
            title: 'Token Expired',
            subTitle: 'Please re-login to the application.',
            buttons: ['Dismiss']
        });
        alert.present();
        this.nav.push(LoginPage);
    }
}