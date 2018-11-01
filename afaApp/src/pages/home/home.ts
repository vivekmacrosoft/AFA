import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceService } from '../../services/device.service';
import { GatewayService } from '../../services/gateway.service';
import { ExceptionService } from '../../services/exception.service';  
import { DeviceInfo } from '../../model/DeviceInfo';
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { CookieService } from 'ngx-cookie-service';
import { Geolocation } from '@ionic-native/geolocation';
import { AgmMap, LatLngBounds } from '@agm/core';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  devices: any[];
  gateways: any[];
  panel: DeviceInfo[];
  show: boolean[];
  showD: boolean[];
  date: Date;
  Min: number;
  dataOne: any[];
  deviceId: any;
  Max: number;
  payloadData: any[];
  userLat: number;
  userLong: number;
  iconObject: string;
  deviceName: string;
  online: boolean;
  setIntervalId: any;
  defaultZoom: number;
  defaultLat: number;
  defaultLong: number;
  defaultLevels: any;
  Name: any[];
  DeviceData: any;
  @ViewChild('AgmMap') agmMap: AgmMap;

  constructor(private geolocation: Geolocation, private cookieService: CookieService, private alertCtrl: AlertController, private deviceService: DeviceService, private exceptionService: ExceptionService, private gatewayService: GatewayService, public navCtrl: NavController, public navParams: NavParams) {
    
    this.date = new Date();
    this.defaultLat = 41.58;
    this.defaultLong = -72.545812;
    this.online = window.navigator.onLine;
    this.defaultZoom = 7;
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLat = resp.coords.latitude;
      this.userLong = resp.coords.longitude;
      this.iconObject = 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png';
    }).catch((error) => {
    });

    if (!this.cookieService.get('Min') || !this.cookieService.get('Max')) {
      this.cookieService.set('Min', "36");
      this.cookieService.set('Max', "55");
    }
    this.Min = parseFloat(this.cookieService.get('Min'));
    this.Max = parseFloat(this.cookieService.get('Max'));
    this.updateData();

  }

  ionViewDidLoad() {
  }

  ngOnDestroy() {
    console.log('onDestroy Triggered');
    if (this.setIntervalId) {
      clearInterval(this.setIntervalId);
    }
  }

  mapReadyFun(event) {
    const bounds: LatLngBounds = new google.maps.LatLngBounds();
    setTimeout(() => {
      for (var i = 0; i < this.panel.length; i++) {
        bounds.extend(new google.maps.LatLng(this.panel[i].lat, this.panel[i].long));
        event.fitBounds(bounds);
        this.defaultLevels = event;
      }
    }, 2000);
  }

  mapReadyFunTwo(event) {
    console.log(event);
    const bounds: LatLngBounds = new google.maps.LatLngBounds();
    for (var i = 0; i < this.panel.length; i++) {
      bounds.extend(new google.maps.LatLng(this.panel[i].lat, this.panel[i].long));
      event.fitBounds(bounds);
      this.defaultLevels = event;
    }
  }

  updateData() {
    this.date = new Date();
    this.panel = [];
    this.show = [];
    this.gatewayService.getAllGateways().subscribe((gatewaysFromApi: any[]) => {
      this.gateways = gatewaysFromApi['Gateways'];
      console.log("Location:" + this.cookieService.get('location'));
      this.deviceService.getAllDevices(this.cookieService.get('location')).subscribe((devicesFromApi: any[]) => {
        this.devices = devicesFromApi['Items'];
        console.log(this.devices);
        for (var i = 0; i < this.devices.length; i++) {
          let currentPanel = new DeviceInfo();
          this.show[i] = false;
          currentPanel.lat = 40.849468;
          currentPanel.long = -74.455642;
          currentPanel.id = this.devices[i].DevEUI;
          currentPanel.createdAt = this.devices[i].CreatedAt;
          currentPanel.name = "Radio Bridge " + [i + 1];
          this.panel.push(currentPanel);
        }
      });

    },
      err => {
        var title, subTitle;
        console.log(err.error.error);
        if (err.error.error === "valid token required.") {
          title = 'Token Expired';
          subTitle = 'Please re-login to the application.';
          this.exceptionService.errorMessage(title, subTitle);

        }
        else if (!this.online) {
          title = 'Internet connection lost!';
          subTitle = 'Please make sure that you are connected to the internet.';
          this.exceptionService.errorMessage(title, subTitle);

        }
        else {
          title = 'Service temporarily down!';
          subTitle = 'Please contact machineQ support at machineq_support@comcast.com.';
          this.exceptionService.errorMessage(title, subTitle);
        }
      });
  }

  toogleAccordion(i) {
    setTimeout(() => {
      if (document.getElementById((i) + '')) {
        document.getElementById((i) + '').scrollIntoView({ behavior: "smooth", block: "start" });
      }

    }, 500);
    if (i !== "doNotToggle") {
      this.show[i] = !this.show[i];

      for (var j = 0; j < this.show.length; j++) {
        if (j != i) {
          this.show[j] = false;
        }
      }
    }
  }

  showAnalytics(name, id) {
    this.deviceId = id;
    this.deviceName = name;
    this.cookieService.set('deviceId', this.deviceId);
    console.log(this.cookieService.get('deviceId'));
    this.cookieService.set('deviceName', this.deviceName);
    console.log(this.cookieService.get('deviceName'));
    this.navCtrl.setRoot('AnalyticsPage');
  }

  openPage() {
    var title = 'Coming soon!';
    var subTitle = 'Functionality is coming soon.';
    this.exceptionService.errorMessage(title, subTitle);

  }

  logout() {
    this.navCtrl.setRoot(LoginPage);
    this.cookieService.delete('xAuthToken');
  }

  resetView(value) {
    value = this.defaultLevels;
    this.mapReadyFunTwo(value);
  }




}