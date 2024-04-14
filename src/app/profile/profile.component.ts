import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Chart} from 'chart.js';
import {User} from '../user/user';
import {CoursesService} from '../courses/courses.service';
import {Course, Declared} from '../courses/course';
import {UserService} from '../user/user.service';
import {Passed} from '../passed/passed';
import {AdvisorService} from '../advisor/advisor.service';
import {Advisor} from '../advisor/advisor';
import {Title} from "@angular/platform-browser";
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


/* --------------- Pie chart  -------------*/

export class ProfileComponent implements OnInit {

  constructor(private router: Router,
              private titleService: Title,
              private coursesService: CoursesService,
              private  userService: UserService,
              private  advisorService: AdvisorService,
              private http: HttpClient) {
  }

  user: User;
  averagegrade: number;
  passed: Passed[] = [];
  direction: String = new String();
  advisors: Advisor[] = [];
  advisor: Advisor = new Advisor();
  years: number[] = [];
  declared: Declared[] = [];
  declaredByYear: number[] = [];
  passedByYear: number[] = [];
  userSemester: number;
  ects: number;
  progress: number;
  alert: number;

  pieChartOptions = {
    responsive: true
  };
  pieChartData: any = [
    {
      data: []
    }
  ];


  public lineChartData: Array<any> = [
    {data: [], label: 'Δηλωμένα'},
    {data: [], label: 'Περασμένα'},
  ];
  public lineChartLabels: Array<any> = [
    {
      data: []
    }
  ];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  pieChartColor: any = [
    {
      backgroundColor: ['rgba(30, 169, 224, 0.8)',
        'rgba(255,165,0,0.9)',
        'rgba(255, 161, 181, 0.9)',
        'rgba(192,192,192,1)'
      ]
    }
  ];

  pieChartLabels = ['5-6.5 ( Καλώς )', '6.5-8.5 ( Λίαν καλώς )', '8.5-10 ( Άριστα )', ' ( Kανένα Μάθημα )'];

  // CHART COLOR.


  ngOnInit() {
    this.titleService.setTitle("Προφίλ");
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user == null) {
      this.router.navigate(['/']);
    } else {
      this.ects = 0;
      this.getPieChartParts();
      this.getAverageGrade();
      this.getPassed();
      this.getAdvisors();
      this.setLineChart();
      this.getDeclared();
    }

  }

  setLineChart(): void {
    setTimeout(() => {

      for (let year of this.years) {


        this.passedByYear[year - 1] = 0;
        this.declaredByYear[year - 1] = 0;

        for (let passed of this.passed) {

          if (passed.year == year && year <= this.advisor.active_year) {
            this.passedByYear[year - 1]++;

          } else if (year > this.advisor.active_year) {
            this.passedByYear[year - 1] = null;
          }

        }


        for (let declared of this.declared) {

          if (declared.year == year && year >= this.advisor.active_year) {
            this.declaredByYear[year - 1]++;
            // console.log(JSON.stringify("declared tou: " + declared.year));
          } else if (year < this.advisor.active_year) {
            this.declaredByYear[year - 1] = null;
          }
        }


      }
      if (this.declaredByYear[this.advisor.active_year - 1] > this.passedByYear[this.advisor.active_year - 1]) {
        this.passedByYear[this.advisor.active_year - 1] = this.declaredByYear[this.advisor.active_year - 1];
      } else {
        this.declaredByYear[this.advisor.active_year - 1] = this.passedByYear[this.advisor.active_year - 1];
      }
      this.lineChartLabels = this.years;
      for (let year of this.years) {
        // this.lineChartLabels.push(year + "ο έτος");
        // this.lineChartLabels = ['1o','2o', '3o', '4o'];

        if (this.declaredByYear[year - 1] != 0) {
          this.lineChartData[0].data.push(this.declaredByYear[year - 1]);
        } else if (this.declaredByYear[year - 1] == 0 && year >= this.advisor.active_year) {
          this.lineChartData[0].data.push(0);
        } else if (this.declaredByYear[year - 1] == 0 && year < this.advisor.active_year) {
          this.lineChartData[0].data.push(null);
        }

        if (this.passedByYear[year - 1] != 0) {
          this.lineChartData[1].data.push(this.passedByYear[year - 1]);
        } else if (this.passedByYear[year - 1] == 0 && year < this.advisor.active_year) {
          this.lineChartData[1].data.push(0);
        } else if (this.passedByYear[year - 1] == 0 && year > this.advisor.active_year) {
          this.lineChartData[1].data.push(null);
        }
      }
    }, 500);

  }

  logout(): void {
    this.http.post<void>(environment.API_URL + '/logout', {}).subscribe();
    localStorage.clear();
    window.location.href = environment.CAS_LOGOUT_URL;
  }


  /* --------------- Pie chart END -------------*/


  /*  ------------- Diagram chart --------------------*/
  getDeclared(): void {
    this.coursesService.getDeclared()
      .subscribe(data => {
        this.declared = data;

      });
  }


  getAdvisors(): void {
    this.advisorService.getAdvisors()
      .subscribe(data => {
        this.advisors = data;
        for (let advisor of this.advisors) {
          if (advisor.active == true) {
            this.advisor = advisor;
            // console.log(advisor.years);
            this.years = [];
            this.years.push(0);
            for (let i = 0; i < advisor.years; i++) {
              this.years.push(i + 1);
            }
            break;
          }
        }
        if (this.advisor.active_examination == 0) {
          this.userSemester = ((this.advisor.active_year - 1) * 2 + this.advisor.active_examination) + 1;
        } else {
          this.userSemester = ((this.advisor.active_year - 1) * 2 + 1) + 1;
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

  // events
  // public chartClicked(e: any): void {
  //   console.log(e);
  // }
  //
  // public chartHovered(e: any): void {
  //   console.log('hovered');
  // }


  /*  ------------- Diagram Chart End--------------------*/


  getPieChartParts(): void {
    this.userService.getPieChartParts()
      .subscribe(data => {
        if (data[0] === 0 && data[1] === 0 && data[2] === 0) {
          this.pieChartData = ['', '', '', 1];
        } else {
          this.pieChartData = data;
        }
      });
  }


  getAverageGrade(): void {
    this.userService.getAverageGrade()
      .subscribe(data => {
        this.averagegrade = data;

      });
  }

  getPassed(): void {
    this.coursesService.getPassed()
      .subscribe(data => {
        this.passed = data;
        for (const passed of this.passed) {
          this.ects = this.ects + passed.course.ects;
        }
        this.progress = this.ects / 2.4;
        var decimal = this.progress % 1;
        if (decimal > 0.5) {
          this.progress = (this.progress - decimal) + 1;
        } else {
          this.progress = this.progress - decimal;
        }
        if (this.progress > 100) {
          this.progress = 100;
        }


      });
  }

  onChartClick(event) {
    console.log(event);
  }

  updateDirection(direction): void {
    console.log(direction);
    this.userService.changeDirection(direction).subscribe(successResponse => {
      // alert(successResponse);
      this.getPieChartParts();
      this.getAverageGrade();
      this.user.direction = direction;
      localStorage.setItem('user', JSON.stringify(this.user));
    }, errorResponse => {
      console.log(errorResponse);
      alert('direction error');
    });

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

      this.getDeclared();
      this.getAverageGrade();
      this.getAdvisors();
      this.getPassed();
      this.alert = 8;
      localStorage.setItem('alert', JSON.stringify(this.alert));
      this.router.navigate(['/advisor']);
    }, errorResponse => {
      alert(errorResponse);
    });
  }


}
