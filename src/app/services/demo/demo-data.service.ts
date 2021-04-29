import {Injectable} from '@angular/core';
import {HttpHelperService} from '../utils/http-helper.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemoDataService {

  constructor(private http: HttpHelperService) {
  }

  /**
   * @returns Observable
   * @param startIndex
   * @param pagesize
   */
  getUsers(startIndex: number, pagesize: number): Observable<any> {

    return this.http.get(`/api/demo/users?startIndex=${startIndex}&pagesize=${pagesize}`);
  }
}
