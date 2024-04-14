import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../user/user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {
  }

  private adminUrl = environment.API_URL + '/admin/';


  public loginAdmin() {
    return this.http.get<String>(this.adminUrl);
  }

  public getUsers() {
    return this.http.get<User[]>(this.adminUrl + 'users');
  }

  public deleteUser(user) {
    return this.http.delete(this.adminUrl + 'deleteUser/' + user.id);
  }

}
