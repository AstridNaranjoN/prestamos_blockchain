import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from "rxjs/Rx";
import { GoogleAuthService } from '../app/googleAuth.service'

@Injectable()
export class HttpServiceBase {

    private urlService: string = "http://146.148.83.41:8080/";
    private accessToken: string = "";

    private headers: Headers;
    private requestOptions: RequestOptions;


    constructor(private http: Http, private googleService: GoogleAuthService) {
        this.headers = new Headers();
        this.headers.set("Content-Type", "application/json");
        this.requestOptions = new RequestOptions({method: RequestMethod.Get, headers: this.headers })
    }

    addAuthorizationHeader() {
        if (this.googleService.isSignedIn) {
            this.headers.set("x-authorization", "Bearer " + this.googleService.auth2.currentUser.get().getAuthResponse().id_token);
            this.headers.set("client_id", this.googleService.clientId)
        }
    }
    get(apiUrl: string) {
        this.addAuthorizationHeader();
        return this.http.get(this.urlService + apiUrl, this.requestOptions )
            .map(this.extractData)
            .catch(this.handleError)
    }

    post(apiUrl: string, model: any) {
        this.addAuthorizationHeader();
        return this.http.post(this.urlService + apiUrl, model, this.requestOptions)
            .map(this.extractData)
            .catch(this.handleError);
    }

    put(apiUrl: string, model: any) {
        this.addAuthorizationHeader();
        return this.http.put(this.urlService + apiUrl, model, this.requestOptions)
            .map(this.extractData)
            .catch(this.handleError);
    }


    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}