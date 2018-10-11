import { AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { Injectable } from '@angular/core';
import { Component, ViewChild } from '@angular/core';


@Injectable()
export class UtilityService {


    getDateFormat(diff) {
        var dateMonthString;
        var dateDayString;
        const date = new Date();
        date.setDate(date.getDate() - diff);
        date.setMonth(date.getUTCMonth() + 1);
        if (date.getUTCMonth() < 10) {
            dateMonthString = "0" + date.getUTCMonth().toString();
        } else {
            dateMonthString = date.getUTCMonth().toString();
        }
        if (date.getUTCDate() <= 9) {
            dateDayString = "0" + date.getUTCDate().toString();
        } else {
            dateDayString = date.getUTCDate().toString();
        }
        const utcTime = date.getUTCFullYear().toString() + "-" + dateMonthString + "-" + dateDayString;
        return utcTime;
    }
}