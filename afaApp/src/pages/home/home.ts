import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceService } from '../../services/device.service';
import { DeviceInfo } from '../../model/DeviceInfo';
import { AlertController } from 'ionic-angular';
import {LoginPage} from '../login/login';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {CookieService} from 'ngx-cookie-service';
import { Geolocation } from '@ionic-native/geolocation';
import { AgmMap, LatLngBounds} from '@agm/core';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  devices:any[];
  gateways:any[];
  panel:DeviceInfo[];
  show:boolean[];
  showD:boolean[];
  date: Date;
  Min:number;
  dataOne:any[];
  deviceId:any;
  Max:number;
  payloadData:any[];
  userLat:number;
  userLong:number;
  iconObject:string;
  deviceName:string;
  online:boolean;
  setIntervalId:any;
  defaultZoom:number;
  defaultLat:number;
  defaultLong:number;
  defaultLevels:any;
  Name: any[];
  @ViewChild('AgmMap') agmMap: AgmMap;

  constructor(private localNotifications: LocalNotifications, private geolocation: Geolocation,private cookieService: CookieService,private alertCtrl: AlertController,private deviceService: DeviceService,public navCtrl: NavController, public navParams: NavParams) {
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
   this.date = new Date();
   this.defaultLat=41.58;
   this.defaultLong=-72.545812;
   this.online = window.navigator.onLine;
   this.defaultZoom=7;
   this.geolocation.getCurrentPosition().then((resp)=>{
   this.userLat = resp.coords.latitude;
   this.userLong = resp.coords.longitude;
   this.iconObject= 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png';
  }).catch((error)=>{
  });

    if(!this.cookieService.get('Min') || !this.cookieService.get('Max'))
    {
      this.cookieService.set('Min',"36");
      this.cookieService.set('Max',"55");
    }
      this.Min = parseFloat(this.cookieService.get('Min'));
      this.Max = parseFloat(this.cookieService.get('Max'));  
   this.updateData();
  this.setIntervalId= setInterval(()=>{
    this.updateData();
   },50000)
  }

  ionViewDidLoad(){ 
  }

  ngOnDestroy()
  {
    console.log('onDestroy Triggered');
    if (this.setIntervalId) {
      clearInterval(this.setIntervalId);
    }
  }

  mapReadyFun(event)
  {
    const bounds: LatLngBounds = new google.maps.LatLngBounds();
    setTimeout(()=>{
      for (var i=0;i<this.panel.length;i++) {
        bounds.extend(new google.maps.LatLng(this.panel[i].lat, this.panel[i].long));
        event.fitBounds(bounds);
        this.defaultLevels=event;
      }
    },2000); 
  }

  mapReadyFunTwo(event)
  {
    console.log(event);
    const bounds: LatLngBounds = new google.maps.LatLngBounds();
    for (var i=0;i<this.panel.length;i++) 
    {
      bounds.extend(new google.maps.LatLng(this.panel[i].lat, this.panel[i].long));
      event.fitBounds(bounds);
      this.defaultLevels=event;
    }
  }

  updateData()
  {
    this.date = new Date();
    this.panel=[];
    this.show=[];
    this.deviceService.getAllGateways().subscribe((gatewaysFromApi:any[])=>{
      this.gateways=gatewaysFromApi['Gateways'];
      this.deviceService.getAllDevices().subscribe((devicesFromApi:any[])=>{
        this.devices=devicesFromApi['Devices'];
        console.log(this.devices);
        for(var i=0;i<this.devices.length;i++)
        { let currentPanel = new DeviceInfo();
          this.show[i]=false;
            currentPanel.lat = 40.849468;
            currentPanel.long = -74.455642;
          currentPanel.id = this.devices[i].DevEUI;
          currentPanel.createdAt = this.devices[i].CreatedAt;
          currentPanel.name = "Radio Bridge "+[i+1];
          this.panel.push(currentPanel);
        }
      });
    },
  err=>{
    console.log(err.error.error);
    if(err.error.error==="valid token required.")
    {
      let alert = this.alertCtrl.create({
        title: 'Token Expired',
        subTitle: 'Please re-login to the application.',
        buttons: ['Dismiss']
      });
      alert.present();
      this.navCtrl.setRoot(LoginPage);
    }
    else if(!this.online){
      let alert = this.alertCtrl.create({
        title: 'Internet connection lost!',
        subTitle: 'Please make sure that you are connected to the internet.',
        buttons: ['Dismiss']
      });
      alert.present();
      this.navCtrl.setRoot(LoginPage);
    }
    else
    {
      let alert = this.alertCtrl.create({
        title: 'Service temporarily down!',
        subTitle: 'Please contact machineQ support at machineq_support@comcast.com.',
        buttons: ['Dismiss']
      });
      alert.present();
      this.navCtrl.setRoot(LoginPage);
    }
  });
  }

  toogleAccordion(i)
  { setTimeout(() => {
    if (document.getElementById((i) + '')) {
      document.getElementById((i) + '').scrollIntoView({ behavior: "smooth", block: "start" });
    }

  }, 500);
    if(i!=="doNotToggle")
  {
    this.show[i]=!this.show[i];

    for(var j=0;j<this.show.length;j++)
    {
      if(j!=i)
      {
        this.show[j]=false;
      }
    }
  }
  }

  showAnalytics(name,id)
  {
    this.deviceId=id;
    this.deviceName=name;
    this.cookieService.set('deviceId',this.deviceId);
    console.log(this.cookieService.get('deviceId'));
    this.cookieService.set('deviceName',this.deviceName);
    console.log(this.cookieService.get('deviceName'));
    this.navCtrl.setRoot('AnalyticsPage');
  }

  openPage()
  {
    let alert = this.alertCtrl.create({
      title: 'Coming soon!',
      subTitle: 'Functionality is coming soon.',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage);  
    this.cookieService.delete('xAuthToken'); 
  }

  resetView(value)
  {
    value=this.defaultLevels;
    this.mapReadyFunTwo(value);
  }
}