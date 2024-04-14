import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Course, CourseSpec, Prerequisite, Professor, Recommended, Specialization} from './course';
import {CoursesService} from './courses.service';
import {AdvisorService} from "../advisor/advisor.service";
import {User} from "../user/user";
import {Advisor} from "../advisor/advisor";
import {Title} from "@angular/platform-browser";
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-course',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  user: User;
  courses: Course [] = [];
  professors: Professor[];
  prerequisites: Prerequisite[];
  recommended: Recommended[];
  specializations: Specialization[];
  selectedCourseSpec: string[] = [];
  selectedCourse: Course = new Course();
  advisors: Advisor[] = [];
  advisor: Advisor;
  alert: number;

  constructor(private router: Router,
              private titleService: Title,
              private coursesService: CoursesService,
              private advisorService: AdvisorService) {
  }

  ngOnInit() {
    this.titleService.setTitle("Προσφερόμενα Μαθήματα");
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user == null) {
      this.router.navigate(['/']);
    } else {
      this.getCourses();
      this.getProfessors();
      this.getPrerequisites();
      this.getRecommended();
      this.getSpecializations();
      this.getAdvisors();
      this.alert = 0;
    }
  }

  selectCourse(course): void {
    let i: any;
    this.selectedCourseSpec = [];

    for (i = 0; i < 6; i++) {
      var err = 0;
      for (let specialization of course.specialization) {

        if (specialization.specialization == i + 1) {

          this.selectedCourseSpec.push(specialization.type);
          err = 1;

        }
      }
      if (err == 0) {
        this.selectedCourseSpec.push('');
      }
    }


    this.selectedCourse = course;
  }

  getCourses(): void {
    this.coursesService.getCourses()
      .subscribe(data => {
        this.courses = data;
        for (let course of this.courses) {
          course.professor = [];
          course.prerequisite = [];
          course.recommended = [];
          course.specialization = [];
        }
      },
      //   error => {window.location.href = environment.CAS_LOGIN_URL;
      // }
        );
  }

  getProfessors(): void {
    this.coursesService.getProfessors()
      .subscribe(data => {
        this.professors = data;
        var i: number;
        for (let professor of this.professors) {
          for (let course of this.courses) {
            if (professor.course.id === course.id) {
              course.professor.push(professor.professor);
            }
          }
        }
      });
  }

  getPrerequisites(): void {
    this.coursesService.getPrerequisites()
      .subscribe(data => {
        this.prerequisites = data;
        for (const prerequisite of this.prerequisites) {
          for (const course of this.courses) {
            if (prerequisite.course.id === course.id) {
              course.prerequisite.push(prerequisite.prerequisite);

            }
          }
        }
      });
  }

  getRecommended(): void {
    this.coursesService.getRecommended()
      .subscribe(data => {
        this.recommended = data;
        for (const recommended of this.recommended) {
          for (const course of this.courses) {
            if (recommended.course.id === course.id) {
              course.recommended.push(recommended.recommended);

            }
          }
        }
      });
  }

  getSpecializations(): void {
    this.coursesService.getSpecializations()
      .subscribe(data => {
        this.specializations = data;
        const dummy = new CourseSpec();
        dummy.specialization = 0;
        dummy.type = '';
        for (const specialization of this.specializations) {
          for (const course of this.courses) {
            if (specialization.course.id === course.id) {
              var tempSpec = new CourseSpec();
              tempSpec.type = specialization.type;
              tempSpec.specialization = specialization.specialization;
              course.specialization.push(tempSpec);
            }

            if (course.specialization.length == 0) {
              course.specialization.push(dummy);
            }

          }
        }
      });
  }

  logout(): void {
    this.coursesService.logout();
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

  deleteAdvisor(): void {
    this.advisorService.deleteAdvisor().subscribe(value => {
      this.alert = 9;
      localStorage.setItem('alert', JSON.stringify(this.alert));
      this.router.navigate(['/advisor']);
    }, errorResponse => {
      alert(errorResponse);
    });
  }

  changeActiveAdvisor(advisor): void {
    this.advisorService.changeActiveAdvisor(advisor.id).subscribe(successResponse => {
      // alert(successResponse);

      this.getCourses();
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

  specializationExist(course, specialization): boolean {
    return course.specialization.find(x => x.specialization == specialization);

  }


}

