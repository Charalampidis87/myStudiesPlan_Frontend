import {Component, OnInit} from '@angular/core';
import {User} from "../user/user";
import {Advisor} from "../advisor/advisor";
import {AdvisorService} from "../advisor/advisor.service";
import {Router} from "@angular/router";
import {UserService} from "../user/user.service";
import {Title} from "@angular/platform-browser";
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  user: User;
  advisors: Advisor[] = [];
  advisor: Advisor = new Advisor();
  direction: string;
  check: boolean;
  alert: number;
  pass: String = new String();
  newPass: String = new String();
  newConfirmPass: String = new String();
  name: string;
  surname: string;
  email: string;
  regNum: string;
  regYear: string;

  constructor(private router: Router,
              private titleService: Title,
              private advisorService: AdvisorService,
              private userService: UserService,
              private http: HttpClient) {
  }
  private apiUrl = environment.API_URL;

  ngOnInit() {
    this.titleService.setTitle("Ρυθμίσεις");
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user == null) {
      this.router.navigate(['/']);
    } else {
      this.user.confirmPassword = this.user.password;
      this.name = this.user.name;
      this.surname = this.user.surname;
      this.email = this.user.email;
      this.direction = this.user.direction;
      this.regNum = this.user.regNum;
      this.regYear = this.user.regYear;
      this.getAdvisors();
      this.check = true;
      this.alert = 0;
    }
  }

  logout(): void {
    this.http.post<void>(environment.API_URL + '/logout', {}).subscribe();
    localStorage.clear();
    window.location.href = environment.CAS_LOGOUT_URL;
  }

  createAdvisor(): void {
    this.advisorService.createAdvisor().subscribe(value => {
      this.alert = 6;
      localStorage.setItem('alert', JSON.stringify(this.alert));
      this.router.navigate(['/advisor']);
    }, errorResponse => {
      alert(errorResponse);
    });
  }

  changeActiveAdvisor(advisor): void {
    this.advisorService.changeActiveAdvisor(advisor.id).subscribe(successResponse => {
      // alert(successResponse);

      this.getAdvisors();
      this.alert = 8;
      localStorage.setItem('alert', JSON.stringify(this.alert));
      this.router.navigate(['/advisor']);
    }, errorResponse => {
      alert(errorResponse);
    });
  }

  getAdvisors(): void {
    this.advisorService.getAdvisors()
      .subscribe(data => {
        this.advisors = data;
        for (let advisor of this.advisors) {
          if (advisor.active == true) {
            this.advisor = advisor;
            break;
          }
        }

      });
  }

  deleteAdvisor(): void {
    this.advisorService.deleteAdvisor().subscribe(value => {
      this.alert = 9;
      localStorage.setItem('alert', JSON.stringify(this.alert));
      this.router.navigate(['/advisor']);
    }, errorResponse => {
      alert(errorResponse);
    });
  }

  editUser(): void {
    this.userService.editUser(this.direction)
      .subscribe(successResponse => {
        this.user.direction = this.direction;
        localStorage.setItem('user', JSON.stringify(this.user));
        // this.user.confirmPassword = this.user.password;
        this.alert = 1;
        this.changeAlert();
      }, errorResponse => {
        alert(errorResponse);
      });
  }

  checkPass(pass, confirm): boolean {
    if (pass != confirm && confirm != '') {
      this.check = false;
      return true;
    } else {
      this.check = true;
      return false;
    }
  }

  cancelPersonal(): void {
    this.name = this.user.name;
    this.surname = this.user.surname;
    this.email = this.user.email;
    this.direction = this.user.direction;
    this.regNum = this.user.regNum;
    this.regYear = this.user.regYear;
  }

  // checkPassword(password): boolean {
  //   if(password != this.user.password && password != '') {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  checkNewPassword(password): boolean {
    // if (password == '') {
    //   this.check = false;
    //   return true;
    // } else {
    //   this.check = true;
    //   return false;
    // }
    if (password.length < 5 && password != '') {
      return true;
    } else {
      return false;
    }
  }

  checkConfirm(pass, confirm): boolean {
    if (confirm != pass && confirm != '') {
      return true;
    } else {
      return false;
    }
  }

  checkPassForm(): boolean {
    return !(this.pass != '' && this.newPass != '' && this.newPass.length >= 5 && this.newPass == this.newConfirmPass && this.newConfirmPass != '');
  }

  changeAlert(): void {
    setTimeout(() => {
      this.alert = 0;
    }, 3000);
  }

}
