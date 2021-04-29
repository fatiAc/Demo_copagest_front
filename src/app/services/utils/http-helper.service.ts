import {Injectable} from '@angular/core';
import {Constants} from '../../constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders
  ({
    // 'Access-Control-Allow-Origin':'*'
  })
};

@Injectable({
  providedIn: 'root'
})



export class HttpHelperService {

  private host: string = Constants.HOST_DOMAINE;

  constructor(private http: HttpClient) {
  }

  /**
   * http post request
   * @param apiRoute
   * @param body
   */

  post(apiRoute: string, body: any): Observable<any> {
    // console.log(this.host + apiRoute);
    return this.http.post<any>(this.host + apiRoute, body, httpOptions);
  }

  postDownloadFiles(apiRoute: string, body: any): Observable<any> {
    // console.log(this.host + apiRoute);
    return this.http.post(this.host + apiRoute, body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-type', 'application/json')
    });
  }

  /**
   * http get request
   * @param apiRoute
   */
  get(apiRoute: string): Observable<any> {
    // console.log(this.host + apiRoute);
    return this.http.get<any>(this.host + apiRoute, httpOptions);
  }

  /**
   *
   * @param apiRoute
   * @param body
   */
  put(apiRoute: string, body: any): Observable<any> {

    return this.http.put<any>(this.host + apiRoute, body, httpOptions);
  }

  /**
   *
   * @param apiRoute
   */
  delete(apiRoute: string): Observable<any> {

    return this.http.delete<any>(this.host + apiRoute, httpOptions);
  }
}
