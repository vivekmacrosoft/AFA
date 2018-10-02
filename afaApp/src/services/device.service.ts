import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Util} from '../constants/util';
import {HttpHeaders} from '@angular/common/http';
 

@Injectable()
export class DeviceService {

  private mqApiString = "https://api.machineq.net/v1/";
  headerAWS = new HttpHeaders();
  




  constructor(private util: Util, private http: HttpClient) {

  }

  getDevice(id) {
    return this.http.get(this.mqApiString + 'devices/' + id, {headers: this.util.SECURED_HEADER});
  }

  getAllDevices() {
    this.headerAWS.set("requestType",'getdevices');
    return this.http.get("https://gkefuynsbd.execute-api.us-east-1.amazonaws.com/TEST/getdevices",{headers:this.headerAWS});
    
  
  }
   
  getAllGateways() {
    return this.http.get(this.mqApiString + 'gateways', {headers: this.util.SECURED_HEADER});
  }


  getDeviceStats(id) {
    return this.http.get(this.mqApiString + 'devices/' + id + '/statistics', {headers: this.util.SECURED_HEADER});
  }

  getPayloadData(macId, lastDay) {
    return this.http.get(this.mqApiString + 'devices/' + macId + '/payloads?StartTime=' + lastDay, {headers: this.util.SECURED_HEADER});
  }

}
