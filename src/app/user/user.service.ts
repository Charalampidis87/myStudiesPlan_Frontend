import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from './user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  private userUrl = environment.API_URL + '/user';
  private loginUrl = environment.API_URL + '/user/login';

  public login() {
    return this.http.get<User>(this.loginUrl);
  }

  public getAverageGrade() {
    return this.http.get<number>(this.userUrl + '/getaveragegrade');
  }

  public getAverageGradeGoal() {
    return this.http.get<number>(this.userUrl + '/getaveragegradegoal');
  }

  public changeDirection(direction) {
    const postRequestParameters = new FormData();
    postRequestParameters.append('direction', direction);
    return this.http.post<String>(this.userUrl + '/updatedirection', postRequestParameters);
  }

  public getPieChartParts() {
    return this.http.get<number[]>(this.userUrl + '/getpiechartsparts');
  }

  public editUser(direction) {
    const postRequestParameters = new FormData();
    postRequestParameters.append('direction', direction);
    return this.http.post<String>(this.userUrl + '/editUser', postRequestParameters);
  }

  public logout() {
    this.http.post<void>(environment.API_URL + '/logout', {}).subscribe();
  }

}
