import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LoginPage} from '../login/login';
import {CookieService} from 'ngx-cookie-service';
import { DeviceInfo } from '../../model/DeviceInfo';
import { DeviceService } from '../../services/device.service';

/**
 * Generated class for the TablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-table',
  templateUrl: 'table.html',
})
export class TablePage {

  deviceName:any;
  deviceId:any;
  payloadData:any[];
  panel:DeviceInfo[];

  constructor(public cookieService: CookieService, private deviceService: DeviceService, public navCtrl: NavController, public navParams: NavParams) {
    this.deviceName=this.cookieService.get('deviceName');
    this.deviceId=this.cookieService.get('deviceId');
    this.payloadData=[];
    this.table();
  }

  table(){
    var dateMonthString;
    var dateDayString;
    this.panel=[];
    const date = new Date();
    date.setDate(date.getDate()-7);
    date.setMonth(date.getUTCMonth()+1);
    if(date.getUTCMonth()<10)
    {
      dateMonthString = "0"+date.getUTCMonth().toString();
    }else{
      dateMonthString = date.getUTCMonth().toString();
    }
    if(date.getUTCDate()<=9){
      dateDayString = "0"+date.getUTCDate().toString();
    }else{
      dateDayString = date.getUTCDate().toString();
    }
    const utcTime = date.getUTCFullYear().toString()+"-"+dateMonthString+"-"+dateDayString+"T00:00:00.000Z";
    console.log(utcTime);
    this.deviceService.getPayloadData(this.deviceId,utcTime).subscribe((data)=>{
      this.payloadData = data['Payloads'];
      console.log(this.payloadData);
      for(var i=0; i<this.payloadData.length; i++){
        let currentPanel = new DeviceInfo();
        const tableDate = new Date(this.payloadData[i].Time);
        currentPanel.date = tableDate;
        currentPanel.RawData = this.payloadData[i].Data.RawData;
        this.panel.push(currentPanel);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TablePage');
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage);
    this.cookieService.delete('xAuthToken'); 
  }

  goBack()
  {
    this.navCtrl.setRoot('AnalyticsPage');
  }

}
