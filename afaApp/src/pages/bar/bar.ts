import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceService } from '../../services/device.service';
import {CookieService} from 'ngx-cookie-service';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';
import {MyCustomPayload} from '../../model/MyCustomPayload';
import {LoginPage} from '../login/login';

/**
 * Generated class for the BarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bar',
  templateUrl: 'bar.html',
})
export class BarPage {

  @ViewChild('bar') bar;

  dateStringArray:string[];
  dateStringArray1:string[];
  barChart: any;
  deviceName:any;
  deviceId:any;
  day1: number;
  day2: number;
  day3: number;
  day4: number;
  day5: number;
  day6: number;
  day7: number;
  payloadData:any[];
  count:any[];
  myCustomPayloadData:MyCustomPayload[];
  constructor(public cookieService: CookieService,private deviceService: DeviceService,public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams) {
    this.deviceName=this.cookieService.get('deviceName');
    this.deviceId=this.cookieService.get('deviceId');
    var i=0;
    this.payloadData=[];
    this.count=[];
    this.myCustomPayloadData=[];
    this.loading();
    this.dateStringArray=[];
    this.dateStringArray1=[];
    for(i=0;i<7;i++)
    {
    var dateForPopArry = new Date();
    dateForPopArry.setDate(dateForPopArry.getDate()-i);
    this.dateStringArray.push(dateForPopArry.getDate().toString()+"-"+(dateForPopArry.getMonth()).toString());
    }
    this.dateStringArray.reverse();
    for(i=0;i<7;i++)
    {
    var dateForPopArry1 = new Date();
    dateForPopArry1.setDate(dateForPopArry1.getDate()-i);
    this.dateStringArray1.push(dateForPopArry1.getDate().toString()+"-"+(dateForPopArry1.getMonth()+1).toString());
    }
    this.dateStringArray1.reverse();
    console.log(this.dateStringArray);
    console.log(this.dateStringArray1);
    setTimeout(()=>{
      this.day1=parseInt(this.dateStringArray[0]);
      this.day2=parseInt(this.dateStringArray[1]);
      this.day3=parseInt(this.dateStringArray[2]);
      this.day4=parseInt(this.dateStringArray[3]);
      this.day5=parseInt(this.dateStringArray[4]);
      this.day6=parseInt(this.dateStringArray[5]);
      this.day7=parseInt(this.dateStringArray[6]);
      console.log(this.day1,this.day2,this.day3,this.day4,this.day5,this.day6,this.day7)
    },1000);
    this.getCount();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BarPage');
  }

  getCount(){
    var dateMonthString;
    var dateDayString;
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
      var i;
      var a=0;
      this.payloadData = data['Payloads'];
      console.log(this.payloadData);
      for(i=0;i<this.payloadData.length;i++)
      {
       var currentDate = new Date(this.payloadData[i].Time);
       this.payloadData[i].Time = currentDate.getDate() + "-" + currentDate.getMonth();
       console.log(this.payloadData[i].Time);
      }
      for(i=0;i<this.dateStringArray.length;i++)
      {
        var myCurrentPayload = new MyCustomPayload();
        myCurrentPayload.date=this.dateStringArray[i];
        this.myCustomPayloadData.push(myCurrentPayload);
      }
      for(i=0;i<this.myCustomPayloadData.length;i++)
      {
        for(var j=0;j<this.payloadData.length;j++)
        {
          if(this.payloadData[j].Time===this.myCustomPayloadData[i].date)
          {
            if(this.payloadData[j].Data.RawData.indexOf('fd')>=0)
            {
              a++;
              this.count[i]=a;
              console.log(this.payloadData[j].Data.RawData);
            }
          }
        }
      }
    });
    setTimeout(()=>{
      this.barGraph();
    },6000);
  }

  loading(){
    let load = this.loadingCtrl.create({
      content:'Loading Please Wait....',
      duration: 6000
    });
    load.present();
  }

  barGraph(){
    console.log(this.count);
    this.barChart = new Chart(this.bar.nativeElement, {
      type: 'bar',
      data: {
        labels: this.dateStringArray1,
        datasets: [{
          label: 'Contact counts per day',
          data: [this.count[0],this.count[1],this.count[2],this.count[3],this.count[4],this.count[5],this.count[6]],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(143, 225, 99, 0.5)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(75, 206, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            scaleLabel:{
              display:true,
              labelString:'Contacts per day'
            },
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            scaleLabel:{
              display:true,
              labelString:'Day'
            }
          }]
        }
      }
    });
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