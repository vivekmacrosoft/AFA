import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class GatewayService {

    constructor( private http: HttpClient) {

    }



getAllGateways() {
    //   return this.http.get(this.mqApiString + 'gateways', {headers: this.util.SECURED_HEADER});
    return this.http.get("https://gkefuynsbd.execute-api.us-east-1.amazonaws.com/TEST/getdevices?requestType=getdevices");
    }
}