import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Advisor} from './advisor';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {

  constructor(private http: HttpClient,
              private router: Router) {
  }

  private apiUrl = environment.API_URL;
  private advisorUrl = environment.API_URL + '/advisor';

  public getAdvisors() {
    return this.http.get<Advisor[]>(this.advisorUrl);
  }

  public createAdvisor() {
    return this.http.get<String>(this.advisorUrl + '/create');
  }

  public deleteAdvisor() {
    return this.http.get<String>(this.advisorUrl + '/delete');
  }

  public addYear() {
    return this.http.get<String>(this.advisorUrl + '/addyear');
  }

  public removeYear() {
    return this.http.get<String>(this.advisorUrl + '/removeyear');
  }

  public changeActiveAdvisor(advisorId) {
    const postRequestParameters = new FormData();

    postRequestParameters.append('advisorId', advisorId);
    return this.http.post<String>(this.advisorUrl + '/changeactive', postRequestParameters);
  }

  public logout() {
    this.http.post<void>(this.apiUrl + '/logout', {}).subscribe();
  }
}
