import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiResponseModelRepos} from '../Model/apiResponseModelRepos';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiRepo {
  constructor(private http: HttpClient) {
  }

  private baseUrl = environment.apiUrl + 'api/repo';

  //get all existing repos
  getRepos() {
    return this.http.get<ApiResponseModelRepos>(this.baseUrl + "/get");
  }
}
