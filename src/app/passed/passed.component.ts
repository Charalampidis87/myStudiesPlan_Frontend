import {Component, OnInit} from '@angular/core';
import {User} from '../user/user';
import {Course} from '../courses/course';
import {Router} from '@angular/router';
import {CoursesService} from '../courses/courses.service';
import {Passed} from './passed';
import {UserService} from '../user/user.service';
import {AdvisorService} from '../advisor/advisor.service';
import {Advisor} from '../advisor/advisor';
import {Title} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-passed',
  templateUrl: './passed.component.html',
  styleUrls: ['./passed.component.css']
})
export class PassedComponent implements OnInit {

  user: User;
  passed: Passed [] = [];
  averageGrade: number;
  advisors: Advisor[] = [];
  advisor: Advisor;
  userEcts: number;
  gradeSum: number;
  alert: number;

  constructor(private router: Router,
              private titleService: Title,
              private coursesService: CoursesService,
              private userService: UserService,
              private advisorService: AdvisorService,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.titleService.setTitle('Περασμένα Μαθήματα');
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user == null) {
      this.router.navigate(['/']);
    } else {
      this.userEcts = 0;
      this.gradeSum = 0;
      this.averageGrade = 0;
      this.getPassed();
      this.getAdvisors();
    }

  }

  onPrint(stoixeia) {
    const printContents = document.getElementById(stoixeia).innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;

  }

  getPassed(): void {
    this.coursesService.getPassed()
      .subscribe(data => {
        this.passed = data;
        for (const passed of this.passed) {

          this.gradeSum = this.gradeSum + passed.grade * passed.course.ects;
          this.userEcts = this.userEcts + passed.course.ects;
        }
        if (this.passed.length != 0) {
          this.averageGrade = this.gradeSum / this.userEcts;
          const decimal = this.averageGrade % 0.01;
          if (decimal > 0.005) {
            this.averageGrade = (this.averageGrade - decimal) + 0.01;
          } else {
            this.averageGrade = this.averageGrade - decimal;
          }
        } else {
          this.averageGrade = 0;
        }

      });
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


      this.getPassed();
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
        for (const advisor of this.advisors) {
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

}
