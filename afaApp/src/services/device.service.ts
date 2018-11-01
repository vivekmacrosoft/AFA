import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


@Injectable()
export class DeviceService {

  //private mqApiString = "https://api.machineq.net/v1/";
  headerAWS = new HttpHeaders();
  constructor(private http: HttpClient) {

  }

  getUser(username) {
    this.headerAWS.set("requestType", "login");
    this.headerAWS.set("username", username);
    return this.http.get("https://gkefuynsbd.execute-api.us-east-1.amazonaws.com/TEST/getdevices", { headers: this.headerAWS });
  }

  // getDevice(id) {
  //   return this.http.get(this.mqApiString + 'devices/' + id, {headers: this.util.SECURED_HEADER});
  // }

  getAllDevices(location) {
    return this.http.get("https://gkefuynsbd.execute-api.us-east-1.amazonaws.com/TEST/getdevices?requestType=getdevices&location=" + location);
  }




  // getDeviceStats(id) {
  //   return this.http.get(this.mqApiString + 'devices/' + id + '/statistics', {headers: this.util.SECURED_HEADER});
  // }

  getPayloadData(macId, lastDay) {
    //return this.http.get(this.mqApiString + 'devices/' + macId + '/payloads?StartTime=' + lastDay, {headers: this.util.SECURED_HEADER});
    console.log(typeof (lastDay));
    return this.http.get("https://gkefuynsbd.execute-api.us-east-1.amazonaws.com/TEST/getdevicedata?requestType=getdevicesdata&Clock="+lastDay+"&DevId="+macId);
  }

}
