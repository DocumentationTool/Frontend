import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiResponseLogin} from '../Model/apiResponseLogin';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiAuth {
  constructor(private http: HttpClient) {
  }

  private baseUrl = environment.apiUrl + "auth";

  login(userId: string, password: string) {
    const params = {userId, password}
    return this.http.post<ApiResponseLogin>(this.baseUrl + "/login", params)
  }

  logout() {
    return this.http.get(this.baseUrl + "/logout");
  }
}
