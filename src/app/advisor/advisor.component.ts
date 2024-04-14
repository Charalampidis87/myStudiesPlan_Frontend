import {Component, Injectable, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Course, CourseSpec, Declared, Prerequisite, Specialization} from '../courses/course';
import {CoursesService} from '../courses/courses.service';
import {User} from '../user/user';
import {UserService} from '../user/user.service';
import {Advisor} from './advisor';
import {AdvisorService} from './advisor.service';
import {isNumber} from 'util';
import {ifTrue} from 'codelyzer/util/function';
import {Passed} from '../passed/passed';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {Title} from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-advisor',
  templateUrl: './advisor.component.html',
  styleUrls: ['./advisor.component.css'],

})
@Injectable()
export class AdvisorComponent implements OnInit {

  // |----------------|
  // | ALERT NUMBERS  |
  // |________________|
  // | declare: 1     |
  // |----------------|
  // | averageGrade: 2|
  // |----------------|
  // | delete: 3      |
  // |----------------|
  // | yearUp: 4      |
  // |----------------|
  // | endExam: 5     |
  // |________________|

  user: User;
  courses: Course [] = [];
  years: number[] = [];
  examinations: number[] = [];
  available: Course[] = [];
  declared: Declared[] = [];
  examination: number[] = [];
  grade: number[] = [];
  gradegoal: number[] = [];
  year: number[] = [];
  averagegrade: number;
  averagegradegoal: number;
  toDeclare: Course[] = [];
  checked: boolean[] = [];
  advisors: Advisor[] = [];
  advisor: Advisor = new Advisor();
  edit: boolean[] = [];
  passed: Passed [] = [];
  prerequisites: Prerequisite[];
  specializations: Specialization[];
  userCourses: Course[] = [];
  userEcts: number;
  mandatories: number;
  directionCourses: number;
  specializationCourses: number;
  specialization1: number;
  specialization2: number;
  specialization3: number;
  specialization4: number;
  specialization5: number;
  specialization6: number;
  m_specialization1: number;
  m_specialization2: number;
  m_specialization3: number;
  m_specialization4: number;
  m_specialization5: number;
  m_specialization6: number;
  project: number;
  generalCourses: number;
  grad_project: number;
  practice: number;
  free: number;
  availableCount: number;
  declaredGrades: number[] = [];
  selectedCourse: Course = new Course();
  alert: number;
  declaredNumber: number;

  constructor(private router: Router,
              private titleService: Title,
              private coursesService: CoursesService,
              private userService: UserService,
              private advisorService: AdvisorService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Το Πρόγραμμά Μου');
    this.alert = 0;
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user == null) {
      this.router.navigate(['/']);
    } else {
      this.alert = JSON.parse(localStorage.getItem('alert'));
      if (this.alert === 8) {
        localStorage.removeItem('alert');
        this.changeAlert();
      }
      this.userEcts = 0;
      this.mandatories = 0;
      this.directionCourses = 0;
      this.specializationCourses = 0;
      this.specialization1 = 0;
      this.specialization2 = 0;
      this.specialization3 = 0;
      this.specialization4 = 0;
      this.specialization5 = 0;
      this.specialization6 = 0;
      this.m_specialization1 = 0;
      this.m_specialization2 = 0;
      this.m_specialization3 = 0;
      this.m_specialization4 = 0;
      this.m_specialization5 = 0;
      this.m_specialization6 = 0;
      this.project = 0;
      this.generalCourses = 0;
      this.grad_project = 0;
      this.practice = 0;
      this.free = 0;
      this.availableCount = 0;

      this.getCourses();
      // this.years = [1,2,3,4];
      this.examinations = [0, 1, 2];
      this.getDeclared();
      this.getAverageGrade();
      this.getGradeGoals();
      this.getAverageGradeGoal();
      this.getAdvisors();
      this.initEdit();
      this.getPassed();
      this.getPrerequisites();
      this.getUserCourses();
      this.getSpecializations();
      setTimeout(() => {
        for (const course of this.declared) {
          if (course.year < this.advisor.active_year || (course.year == this.advisor.active_year && course.examination < this.advisor.active_examination)) {
            this.deleteDeclaredCourse(course.course);
          }
        }
      }, 100);
    }

  }


  getCourses(): void {
    this.coursesService.getCourses()
      .subscribe(data => {
        this.courses = data;
        for (const course of this.courses) {
          course.professor = [];
          course.prerequisite = [];
          course.specialization = [];
          course.available = false;
          this.availableCount++;
        }
      });
  }

  getUserCourses(): void {
    setTimeout(() => {
      this.coursesService.getUserCourses()
        .subscribe(data => {
          this.userEcts = 0;
          this.mandatories = 0;
          this.directionCourses = 0;
          this.specializationCourses = 0;
          this.specialization1 = 0;
          this.specialization2 = 0;
          this.specialization3 = 0;
          this.specialization4 = 0;
          this.specialization5 = 0;
          this.specialization6 = 0;
          this.m_specialization1 = 0;
          this.m_specialization2 = 0;
          this.m_specialization3 = 0;
          this.m_specialization4 = 0;
          this.m_specialization5 = 0;
          this.m_specialization6 = 0;
          this.project = 0;
          this.generalCourses = 0;
          this.grad_project = 0;
          this.practice = 0;
          this.free = 0;
          this.userCourses = data;

          const dummy = new CourseSpec();
          dummy.specialization = 0;
          dummy.type = '';
          for (const course of this.userCourses) {
            course.specialization = [];
            for (const specialization of this.specializations) {


              // course.specialization = [];
              if (specialization.course.id === course.id) {

                // console.log("specialization course: " + specialization.course.id);
                var tempSpec = new CourseSpec();
                tempSpec.type = specialization.type;
                tempSpec.specialization = specialization.specialization;
                course.specialization.push(tempSpec);

              }
              // console.log("course: " + course.name);
              // console.log("specialization: " + specialization.course.name);
              // console.log("course length: " + course.specialization.length);


              // console.log("professor: " + JSON.stringify(professor.professor));

              // console.log("professors course: " + JSON.stringify(course.professor));

            }
            if (course.specialization.length == 0) {
              course.specialization.push(dummy);
            }
          }


          for (const course of this.userCourses) {


            const foundDeclared = this.declared.find(x => x.course.id == course.id);
            if (foundDeclared != null) {
              this.availableCount--;
              course.available = foundDeclared.available;
            }
            const foundPassed = this.passed.find(x => x.course.id == course.id);
            if (foundPassed != null) {
              this.availableCount--;
              course.available = foundPassed.available;
            }
            this.userEcts = this.userEcts + course.ects;
            // console.log(course.type);
            if (course.type == 'ΥΜ') {
              this.mandatories++;

            } else if (course.type == 'ΕΥΜ') {
              // console.log('course: ' + course.direction + " user: " + this.user.direction);
              if (course.direction == this.user.direction) {

                this.directionCourses++;
              }
              var flag = 0;
              for (let specialization of course.specialization) {
                if (specialization.specialization == 1) {

                  if (specialization.type == 'Υποχρεωτικό') {
                    this.m_specialization1++;
                  }
                  if (specialization.type == 'Βασικό') {
                    if (this.user.direction == 'Α') {
                      if (flag == 0) {
                        this.specializationCourses++;
                        flag = 1;
                      }
                    }
                    this.specialization1++;
                  }
                }
                if (specialization.specialization == 2) {
                  if (specialization.type == 'Υποχρεωτικό') {
                    this.m_specialization2++;
                  }
                  if (specialization.type == 'Βασικό') {
                    if (this.user.direction == 'Α') {

                      if (flag == 0) {
                        this.specializationCourses++;
                        flag = 1;
                      }
                    }
                    this.specialization2++;
                  }
                }
                if (specialization.specialization == 3) {
                  if (specialization.type == 'Υποχρεωτικό') {
                    this.m_specialization3++;
                  }
                  if (specialization.type == 'Βασικό') {
                    if (this.user.direction == 'Α') {

                      if (flag == 0) {
                        this.specializationCourses++;
                        flag = 1;
                      }
                    }
                    this.specialization3++;
                  }
                }
                if (specialization.specialization == 4) {
                  if (specialization.type == 'Υποχρεωτικό') {
                    this.m_specialization4++;
                  }
                  if (specialization.type == 'Βασικό') {
                    if (this.user.direction == 'Β') {

                      if (flag == 0) {
                        this.specializationCourses++;
                        flag = 1;
                      }
                    }
                    this.specialization4++;
                  }
                }
                if (specialization.specialization == 5) {
                  if (specialization.type == 'Υποχρεωτικό') {
                    this.m_specialization5++;
                  }
                  if (specialization.type == 'Βασικό') {
                    if (this.user.direction == 'Β') {

                      if (flag == 0) {
                        this.specializationCourses++;
                        flag = 1;
                      }
                    }
                    this.specialization5++;
                  }
                }
                if (specialization.specialization == 6) {
                  if (specialization.type == 'Υποχρεωτικό') {
                    this.m_specialization6++;
                  }
                  if (specialization.type == 'Βασικό') {
                    if (this.user.direction == 'Β') {

                      if (flag == 0) {
                        this.specializationCourses++;
                        flag = 1;
                      }
                    }
                    this.specialization6++;
                  }
                }

              }
              // }
            } else if (course.type == 'ΠΜ') {
              var flag = 0;
              for (let specialization of course.specialization) {

                if (specialization.specialization == 1) {
                  if (specialization.type == 'Βασικό') {
                    if (this.user.direction == 'Α') {

                      if (flag == 0) {
                        this.specializationCourses++;
                        flag = 1;
                      }
                    }

                    this.specialization1++;
                  }
                }
                if (specialization.specialization == 2) {
                  if (specialization.type == 'Βασικό') {
                    if (this.user.direction == 'Α') {

                      if (flag == 0) {
                        this.specializationCourses++;
                        flag = 1;
                      }
                    }
                    this.specialization2++;
                  }
                }
                if (specialization.specialization == 3) {
                  if (specialization.type == 'Βασικό') {
                    if (this.user.direction == 'Α') {

                      if (flag == 0) {
                        this.specializationCourses++;
                        flag = 1;
                      }
                    }
                    this.specialization3++;
                  }
                }
                if (specialization.specialization == 4) {
                  if (specialization.type == 'Βασικό') {
                    if (this.user.direction == 'Β') {

                      if (flag == 0) {
                        this.specializationCourses++;
                        flag = 1;
                      }
                    }
                    this.specialization4++;
                  }
                }
                if (specialization.specialization == 5) {
                  if (specialization.type == 'Βασικό') {
                    if (this.user.direction == 'Β') {

                      if (flag == 0) {
                        this.specializationCourses++;
                        flag = 1;
                      }
                    }
                    this.specialization5++;
                  }
                }
                if (specialization.specialization == 6) {
                  if (specialization.type == 'Βασικό') {
                    if (this.user.direction == 'Β') {

                      if (flag == 0) {
                        this.specializationCourses++;
                        flag = 1;
                      }
                    }
                    this.specialization6++;
                  }
                }

              }


            } else if (course.type == 'Project') {
              if (course.direction == this.user.direction) {
                this.project++;
              }
            } else if (course.type == 'ΓΠ') {
              this.generalCourses++;
            } else if (course.type == 'ΠΕ') {
              this.grad_project++;
            } else if (course.type == 'ΠΑ') {
              this.practice++;
            } else if (course.type == 'ΕΛ') {
              this.free++;
            }
          }


          // console.log(this.mandatories);
        });
    }, 600);
  }

  getPrerequisites(): void {
    this.coursesService.getPrerequisites()
      .subscribe(data => {
        this.prerequisites = data;

        for (const course of this.courses) {
          for (const prerequisite of this.prerequisites) {
            if (prerequisite.course.id === course.id) {
              course.prerequisite.push(prerequisite.prerequisite);
              const foundDeclared = this.declared.find(x => x.course.id == prerequisite.prerequisite.id);
              const foundPassed = this.passed.find(x => x.course.id == prerequisite.prerequisite.id);
              const isDeclared = this.declared.find(x => x.course.id == prerequisite.course.id);
              const isPassed = this.passed.find(x => x.course.id == prerequisite.course.id);

              if (foundDeclared == null && foundPassed == null) {
                course.available = true;
                if (isDeclared == null && isPassed == null) {
                  this.availableCount--;
                }

                break;
              } else {
                course.available = false;
                // this.availableCount++;
              }
            }
          }
        }
        // console.log(JSON.stringify(this.prerequisites[0].prerequisite.name));
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

            // console.log("professor: " + JSON.stringify(professor.professor));

            // console.log("professors course: " + JSON.stringify(course.professor));

          }

          for (const declared of this.declared) {
            // console.log("declared: " + declared.course.name);
            if (specialization.course.id === declared.course.id) {
              var tempSpec = new CourseSpec();
              tempSpec.type = specialization.type;
              tempSpec.specialization = specialization.specialization;
              declared.course.specialization.push(tempSpec);
            }

            if (declared.course.specialization.length == 0) {
              declared.course.specialization.push(dummy);
            }

            // console.log("professor: " + JSON.stringify(professor.professor));

            // console.log("professors course: " + JSON.stringify(course.professor));

          }
          // console.log(specialization.course.name);
          for (const passed of this.passed) {

            if (specialization.course.id === passed.course.id) {
              var tempSpec = new CourseSpec();
              tempSpec.type = specialization.type;
              tempSpec.specialization = specialization.specialization;
              passed.course.specialization.push(tempSpec);
            }

            if (passed.course.specialization.length == 0) {
              passed.course.specialization.push(dummy);
            }

            // console.log("professor: " + JSON.stringify(professor.professor));

            // console.log("professors course: " + JSON.stringify(course.professor));

          }
        }
        // console.log(JSON.stringify(this.prerequisites[0].prerequisite.name));
      });
  }


  logout(): void {
    this.advisorService.logout();
    localStorage.clear();
    window.location.href = environment.CAS_LOGOUT_URL;
  }

  getAvailable(year, examination): void {
    this.coursesService.getAvailable(year, examination)
      .subscribe(data => {
        this.available = data;
        for (let i = 0; i < this.available.length; i++) {
          this.checked[i] = false;
        }
      });
  }

  getDeclared(): void {

    this.coursesService.getDeclared()
      .subscribe(data => {
        this.declared = data;
        this.declaredGrades = [];
        for (const d of this.declared) {
          this.declaredGrades.push(d.grade);
          d.course.specialization = [];
        }
      });
  }

  getGradeGoals(): void {
    this.coursesService.getGradeGoals().subscribe(data => {
      this.gradegoal = data;
    });

  }

  getAverageGrade(): void {
    this.userService.getAverageGrade()
      .subscribe(data => {
        this.averagegrade = data;
      });
  }

  getAverageGradeGoal(): void {
    this.userService.getAverageGradeGoal()
      .subscribe(data => {
        this.averagegradegoal = data;
      });
  }

  createGradeGoal(course, gradegoal): void {
    // console.log(this.gradegoal);
    this.coursesService.createGradeGoal(course.id, gradegoal).subscribe(successResponse => {
      // alert(successResponse);
      this.examination = [];
      this.grade = [];
      this.year = [];
      this.getDeclared();
      this.getAverageGrade();
      this.getGradeGoals();
      this.getAverageGradeGoal();
      this.getAdvisors();
      this.alert = 7;
      this.changeAlert();
    }, errorResponse => {
      alert(errorResponse);
    });

  }

  createPassedCourse(course, examination, grade, year): void {
    this.coursesService.createPassedCourse(course.id, examination, grade, year).subscribe(successResponse => {
      // alert(successResponse);
      this.examination = [];
      this.grade = [];
      this.year = [];
      this.getDeclared();
      this.getAverageGrade();
      this.getGradeGoals();
      this.getAverageGradeGoal();
      this.getAdvisors();
    }, errorResponse => {
      alert(errorResponse);
    });
  }

  addDeclaredGrade(course, examination, grade, year): void {
    this.coursesService.addDeclaredGrade(course.id, examination, grade, year).subscribe(successResponse => {
      // alert(successResponse);
      this.examination = [];
      this.grade = [];
      this.year = [];
      this.getDeclared();
      this.getAverageGrade();
      this.getGradeGoals();
      this.getAverageGradeGoal();
      this.getAdvisors();
      if (grade >= 5) {
        this.alert = 2;
        this.changeAlert();
      }

      // console.log(this.declared[0].grade);
    }, errorResponse => {
      alert(errorResponse);
    });

  }

  addPassedGrade(course, examination, grade, year): void {
    this.coursesService.addPassedGrade(course.id, examination, grade, year).subscribe(successResponse => {
      // alert(successResponse);
      this.examination = [];
      this.grade = [];
      this.year = [];
      this.getDeclared();
      this.getAverageGrade();
      this.getGradeGoals();
      this.getAverageGradeGoal();
      this.getAdvisors();
      this.getPassed();
      if (grade >= 5) {
        this.alert = 2;
        this.changeAlert();
      }
      // console.log(this.declared[0].grade);
    }, errorResponse => {
      alert(errorResponse);
    });

  }

  deleteDeclaredCourse(course): void {
    // console.log("course: " + JSON.stringify(course));

    this.coursesService.deleteDeclaredCourse(course.id).subscribe(successResponse => {
      // alert(successResponse);
      this.userEcts = this.userEcts - course.ects;
      // console.log(course.type);
      if (course.type == 'ΥΜ') {
        this.mandatories--;

      } else if (course.type == 'ΕΥΜ') {
        // console.log('course: ' + course.direction + " user: " + this.user.direction);
        if (course.direction == this.user.direction) {

          this.directionCourses--;
        }
        var flag = 0;
        for (let specialization of course.specialization) {
          if (specialization.specialization == 1) {

            if (specialization.type == 'Υποχρεωτικό') {
              this.m_specialization1--;
            }
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Α') {
                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization1--;
            }
          }
          if (specialization.specialization == 2) {
            if (specialization.type == 'Υποχρεωτικό') {
              this.m_specialization2--;
            }
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Α') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization2--;
            }
          }
          if (specialization.specialization == 3) {
            if (specialization.type == 'Υποχρεωτικό') {
              this.m_specialization3--;
            }
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Α') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization3--;
            }
          }
          if (specialization.specialization == 4) {
            if (specialization.type == 'Υποχρεωτικό') {
              this.m_specialization4--;
            }
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Β') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization4--;
            }
          }
          if (specialization.specialization == 5) {
            if (specialization.type == 'Υποχρεωτικό') {
              this.m_specialization5--;
            }
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Β') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization5--;
            }
          }
          if (specialization.specialization == 6) {
            if (specialization.type == 'Υποχρεωτικό') {
              this.m_specialization6--;
            }
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Β') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization6--;
            }
          }

        }
        // }
      } else if (course.type == 'ΠΜ') {
        var flag = 0;
        for (let specialization of course.specialization) {

          if (specialization.specialization == 1) {
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Α') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }

              this.specialization1--;
            }
          }
          if (specialization.specialization == 2) {
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Α') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization2--;
            }
          }
          if (specialization.specialization == 3) {
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Α') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization3--;
            }
          }
          if (specialization.specialization == 4) {
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Β') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization4--;
            }
          }
          if (specialization.specialization == 5) {
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Β') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization5--;
            }
          }
          if (specialization.specialization == 6) {
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Β') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization6--;
            }
          }

        }


      } else if (course.type == 'Project') {
        if (course.direction == this.user.direction) {
          this.project--;
        }
      } else if (course.type == 'ΓΠ') {
        this.generalCourses--;
      } else if (course.type == 'ΠΕ') {
        this.grad_project--;
      } else if (course.type == 'ΠΑ') {
        this.practice--;
      } else if (course.type == 'ΕΛ') {
        this.free--;
      }
      const index = this.userCourses.findIndex(order => order.id === course.id);
      this.userCourses.splice(index, 1);
      // this.availableCount++;
      this.getDeclared();
      this.getAverageGrade();
      this.getGradeGoals();
      this.getAverageGradeGoal();
      this.getAdvisors();
      this.getPassed();
      this.checkAvailable();
      this.alert = 3;
      this.changeAlert();
      // for (const prerequisite of this.prerequisites) {
      //   for (const course of this.courses) {
      //     if (prerequisite.course.id === course.id) {
      //       var foundDeclared = this.declared.find(x => x.course.id == prerequisite.prerequisite.id);
      //       var foundPassed = this.passed.find(x => x.course.id == prerequisite.prerequisite.id);
      //       console.log("foundDeclared" + foundDeclared.course.name)
      //       console.log("foundPassed" + foundPassed.course.name)
      //       if (foundDeclared == null && foundPassed == null) {
      //
      //         course.available = true;
      //       }else{
      //         course.available = false;
      //       }
      //     }
      //   }
      // }

    }, errorResponse => {
      alert(errorResponse);
    });

  }

  deletePassedCourse(course): void {

    this.coursesService.deletePassedCourse(course.id).subscribe(successResponse => {
      // alert(successResponse);
      this.userEcts = this.userEcts - course.ects;
      console.log(JSON.stringify(course));
      if (course.type == 'ΥΜ') {
        this.mandatories--;

      } else if (course.type == 'ΕΥΜ') {
        // console.log('course: ' + course.direction + " user: " + this.user.direction);
        if (course.direction == this.user.direction) {

          this.directionCourses--;
        }
        var flag = 0;
        for (let specialization of course.specialization) {
          if (specialization.specialization == 1) {

            if (specialization.type == 'Υποχρεωτικό') {
              this.m_specialization1--;
            }
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Α') {
                if (flag == 0) {
                  console.log(course.name);
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization1--;
            }
          }
          if (specialization.specialization == 2) {
            if (specialization.type == 'Υποχρεωτικό') {
              this.m_specialization2--;
            }
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Α') {

                if (flag == 0) {
                  console.log(course.name);
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization2--;
            }
          }
          if (specialization.specialization == 3) {
            if (specialization.type == 'Υποχρεωτικό') {
              this.m_specialization3--;
            }
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Α') {

                if (flag == 0) {
                  console.log(course.name);
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization3--;
            }
          }
          if (specialization.specialization == 4) {
            if (specialization.type == 'Υποχρεωτικό') {
              this.m_specialization4--;
            }
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Β') {

                if (flag == 0) {
                  console.log(course.name);
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization4--;
            }
          }
          if (specialization.specialization == 5) {
            if (specialization.type == 'Υποχρεωτικό') {
              this.m_specialization5--;
            }
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Β') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization5--;
            }
          }
          if (specialization.specialization == 6) {
            if (specialization.type == 'Υποχρεωτικό') {
              this.m_specialization6--;
            }
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Β') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization6--;
            }
          }

        }
        // }
      } else if (course.type == 'ΠΜ') {
        var flag = 0;
        for (let specialization of course.specialization) {

          if (specialization.specialization == 1) {
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Α') {

                if (flag == 0) {
                  console.log(course.name);
                  this.specializationCourses--;
                  flag = 1;
                }
              }

              this.specialization1--;
            }
          }
          if (specialization.specialization == 2) {
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Α') {

                if (flag == 0) {
                  console.log(course.name);
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization2--;
            }
          }
          if (specialization.specialization == 3) {
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Α') {

                if (flag == 0) {
                  console.log(course.name);
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization3--;
            }
          }
          if (specialization.specialization == 4) {
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Β') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization4--;
            }
          }
          if (specialization.specialization == 5) {
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Β') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization5--;
            }
          }
          if (specialization.specialization == 6) {
            if (specialization.type == 'Βασικό') {
              if (this.user.direction == 'Β') {

                if (flag == 0) {
                  this.specializationCourses--;
                  flag = 1;
                }
              }
              this.specialization6--;
            }
          }

        }


      } else if (course.type == 'Project') {
        if (course.direction == this.user.direction) {
          this.project--;
        }
      } else if (course.type == 'ΓΠ') {
        this.generalCourses--;
      } else if (course.type == 'ΠΕ') {
        this.grad_project--;
      } else if (course.type == 'ΠΑ') {
        this.practice--;
      } else if (course.type == 'ΕΛ') {
        this.free--;
      }
      const index = this.userCourses.findIndex(order => order.id === course.id);
      this.userCourses.splice(index, 1);
      // this.availableCount++;
      this.getDeclared();
      this.getAverageGrade();
      this.getGradeGoals();
      this.getAverageGradeGoal();
      this.getAdvisors();
      this.getPassed();
      this.checkAvailable();
      this.alert = 3;
      this.changeAlert();
    }, errorResponse => {
      alert(errorResponse);
    });

  }


  checkGrade(grade): boolean {
    if (grade < 0 || grade > 10 || grade === undefined || isNaN(grade) || grade === '') {
      return true;
    } else {
      return false;
    }
  }

  checkGradeGoal(gradeGoal): boolean {
    if (gradeGoal < 5 || gradeGoal > 10 || gradeGoal === undefined) {
      return true;
    } else {
      return false;
    }
  }

  declare(year, examination): void {
    for (let i = 0; i < this.available.length; i++) {
      if (this.checked[i] == true) {
        this.toDeclare.push(this.available[i]);
        // this.availableCount--;
      }
    }


    this.coursesService.declare(year, examination, JSON.stringify(this.toDeclare))
      .subscribe(successResponse => {
        this.declaredNumber = 0;

        const dummy = new CourseSpec();
        dummy.specialization = 0;
        dummy.type = '';
        for (const course of this.toDeclare) {
          this.declaredNumber++;
          course.specialization = [];
          for (const specialization of this.specializations) {


            // course.specialization = [];
            if (specialization.course.id === course.id) {

              // console.log("specialization course: " + specialization.course.id);
              var tempSpec = new CourseSpec();
              tempSpec.type = specialization.type;
              tempSpec.specialization = specialization.specialization;
              course.specialization.push(tempSpec);

            }

          }
          if (course.specialization.length == 0) {
            course.specialization.push(dummy);
          }
        }


        for (const course of this.toDeclare) {
          this.userEcts = this.userEcts + course.ects;
          if (course.type == 'ΥΜ') {
            this.mandatories++;

          } else if (course.type == 'ΕΥΜ') {
            // console.log('course: ' + course.direction + " user: " + this.user.direction);
            if (course.direction == this.user.direction) {

              this.directionCourses++;
            }
            var flag = 0;
            for (let specialization of course.specialization) {
              if (specialization.specialization == 1) {

                if (specialization.type == 'Υποχρεωτικό') {
                  this.m_specialization1++;
                }
                if (specialization.type == 'Βασικό') {
                  if (this.user.direction == 'Α') {
                    if (flag == 0) {
                      this.specializationCourses++;
                      flag = 1;
                    }
                  }
                  this.specialization1++;
                }
              }
              if (specialization.specialization == 2) {
                if (specialization.type == 'Υποχρεωτικό') {
                  this.m_specialization2++;
                }
                if (specialization.type == 'Βασικό') {
                  if (this.user.direction == 'Α') {

                    if (flag == 0) {
                      this.specializationCourses++;
                      flag = 1;
                    }
                  }
                  this.specialization2++;
                }
              }
              if (specialization.specialization == 3) {
                if (specialization.type == 'Υποχρεωτικό') {
                  this.m_specialization3++;
                }
                if (specialization.type == 'Βασικό') {
                  if (this.user.direction == 'Α') {

                    if (flag == 0) {
                      this.specializationCourses++;
                      flag = 1;
                    }
                  }
                  this.specialization3++;
                }
              }
              if (specialization.specialization == 4) {
                if (specialization.type == 'Υποχρεωτικό') {
                  this.m_specialization4++;
                }
                if (specialization.type == 'Βασικό') {
                  if (this.user.direction == 'Β') {

                    if (flag == 0) {
                      this.specializationCourses++;
                      flag = 1;
                    }
                  }
                  this.specialization4++;
                }
              }
              if (specialization.specialization == 5) {
                if (specialization.type == 'Υποχρεωτικό') {
                  this.m_specialization5++;
                }
                if (specialization.type == 'Βασικό') {
                  if (this.user.direction == 'Β') {

                    if (flag == 0) {
                      this.specializationCourses++;
                      flag = 1;
                    }
                  }
                  this.specialization5++;
                }
              }
              if (specialization.specialization == 6) {
                if (specialization.type == 'Υποχρεωτικό') {
                  this.m_specialization6++;
                }
                if (specialization.type == 'Βασικό') {
                  if (this.user.direction == 'Β') {

                    if (flag == 0) {
                      this.specializationCourses++;
                      flag = 1;
                    }
                  }
                  this.specialization6++;
                }
              }

            }
            // }
          } else if (course.type == 'ΠΜ') {
            var flag = 0;
            for (let specialization of course.specialization) {

              if (specialization.specialization == 1) {
                if (specialization.type == 'Βασικό') {
                  if (this.user.direction == 'Α') {

                    if (flag == 0) {
                      this.specializationCourses++;
                      flag = 1;
                    }
                  }

                  this.specialization1++;
                }
              }
              if (specialization.specialization == 2) {
                if (specialization.type == 'Βασικό') {
                  if (this.user.direction == 'Α') {

                    if (flag == 0) {
                      this.specializationCourses++;
                      flag = 1;
                    }
                  }
                  this.specialization2++;
                }
              }
              if (specialization.specialization == 3) {
                if (specialization.type == 'Βασικό') {
                  if (this.user.direction == 'Α') {

                    if (flag == 0) {
                      this.specializationCourses++;
                      flag = 1;
                    }
                  }
                  this.specialization3++;
                }
              }
              if (specialization.specialization == 4) {
                if (specialization.type == 'Βασικό') {
                  if (this.user.direction == 'Β') {

                    if (flag == 0) {
                      this.specializationCourses++;
                      flag = 1;
                    }
                  }
                  this.specialization4++;
                }
              }
              if (specialization.specialization == 5) {
                if (specialization.type == 'Βασικό') {
                  if (this.user.direction == 'Β') {

                    if (flag == 0) {
                      this.specializationCourses++;
                      flag = 1;
                    }
                  }
                  this.specialization5++;
                }
              }
              if (specialization.specialization == 6) {
                if (specialization.type == 'Βασικό') {
                  if (this.user.direction == 'Β') {

                    if (flag == 0) {
                      this.specializationCourses++;
                      flag = 1;
                    }
                  }
                  this.specialization6++;
                }
              }

            }


          } else if (course.type == 'Project') {
            if (course.direction == this.user.direction) {
              this.project++;
            }
          } else if (course.type == 'ΓΠ') {
            this.generalCourses++;
          } else if (course.type == 'ΠΕ') {
            this.grad_project++;
          } else if (course.type == 'ΠΑ') {
            this.practice++;
          } else if (course.type == 'ΕΛ') {
            this.free++;
          }
          this.userCourses.push(course);
        }

        this.available = [];
        this.checked = [];
        this.toDeclare = [];
        this.getDeclared();
        this.getAverageGrade();
        this.getGradeGoals();
        this.getAverageGradeGoal();
        this.getAdvisors();
        this.getPassed();
        this.getSpecializations();
        this.checkAvailable();
        this.alert = 1;
        this.changeAlert();
        // alert(successResponse);
      }, errorResponse => {
        alert(errorResponse.error);
      });

  }

  getAdvisors(): void {
    this.advisorService.getAdvisors()
      .subscribe(data => {
        this.advisors = data;
        for (const advisor of this.advisors) {
          if (advisor.active == true) {
            this.advisor = advisor;
            this.years = [];
            for (let i = 0; i < advisor.years; i++) {
              this.years.push(i + 1);
            }
            break;
          }
        }
      });
  }

  createAdvisor(): void {
    this.advisorService.createAdvisor().subscribe(successResponse => {
      // alert(successResponse);

      this.getCourses();
      this.getUserCourses();
      this.getPrerequisites();
      this.getDeclared();
      this.getAverageGrade();
      this.getGradeGoals();
      this.getAverageGradeGoal();
      this.getAdvisors();
      this.initEdit();
      this.getPassed();
      this.checkAvailable();
      this.edit[0] = true;
      this.alert = 6;
      this.changeAlert();
    }, errorResponse => {
      alert(errorResponse);
    });
  }

  deleteAdvisor(): void {
    this.advisorService.deleteAdvisor().subscribe(successResponse => {
      // alert(successResponse);

      this.getCourses();
      this.getUserCourses();
      this.getPrerequisites();
      this.getDeclared();
      this.getAverageGrade();
      this.getGradeGoals();
      this.getAverageGradeGoal();
      this.getAdvisors();
      this.initEdit();
      this.getPassed();
      this.checkAvailable();
      this.edit[0] = true;
      this.alert = 9;
      this.changeAlert();
    }, errorResponse => {
      alert(errorResponse);
    });
  }

  initEdit(): void {
    setTimeout(() => {
      const size = this.years.length * this.examinations.length;
      for (let i = 0; i < size; i++) {
        this.edit[i] = false;

      }
    }, 500);
  }


  changeEdit(year, examination): void {
    const i = ((year - 1) * 3) + examination;
    this.edit[i] = true;

  }

  endExamination(year, examination): void {

    this.coursesService.passDeclared(year, examination)
      .subscribe(successResponse => {

        const i = ((year - 1) * 3) + examination;
        this.edit[i] = false;
        if (i < this.edit.length) {
          if (this.advisor.active_year == year && this.advisor.active_examination == examination) {
            this.edit[i + 1] = true;
          }
        }

        this.getDeclared();
        this.getAverageGrade();
        this.getGradeGoals();
        this.getAverageGradeGoal();
        this.getAdvisors();
        this.getPassed();
        this.getUserCourses();
        this.checkAvailable();
        this.alert = 5;
        this.changeAlert();
        // alert(successResponse);
      }, errorResponse => {
        alert(errorResponse.error);
      });


  }

  getPassed(): void {
    this.coursesService.getPassed()
      .subscribe(data => {
        this.passed = data;

        for (const p of this.passed) {
          p.course.specialization = [];
        }
      });
  }

  addYear(): void {
    this.advisorService.addYear().subscribe(successResponse => {
      this.getDeclared();
      this.getAverageGrade();
      this.getGradeGoals();
      this.getAverageGradeGoal();
      this.getAdvisors();
      this.getPassed();
      this.alert = 4;
      this.changeAlert();
      // alert(successResponse);
    }, errorResponse => {
      alert(errorResponse);
    });
  }

  removeYear(): void {
    this.advisorService.removeYear().subscribe(successResponse => {
      this.getDeclared();
      this.getAverageGrade();
      this.getGradeGoals();
      this.getAverageGradeGoal();
      this.getAdvisors();
      this.getPassed();
      // alert(successResponse);
    }, errorResponse => {
      alert(errorResponse);
    });
  }

  changeActiveAdvisor(advisor): void {
    this.advisorService.changeActiveAdvisor(advisor.id).subscribe(successResponse => {
      // alert(successResponse);

      this.getCourses();
      this.getUserCourses();
      this.getPrerequisites();
      this.getDeclared();
      this.getAverageGrade();
      this.getGradeGoals();
      this.getAverageGradeGoal();
      this.getAdvisors();
      this.initEdit();
      this.getPassed();
      this.checkAvailable();
      this.alert = 8;
      this.changeAlert();
    }, errorResponse => {
      alert(errorResponse);
    });
  }

  existDeclared(course): boolean {
    const found = this.declared.find(x => x.course.id == course.id);
    return found != null;
  }

  existPassed(course): boolean {
    const found = this.passed.find(x => x.course.id == course.id);
    return found != null;
  }

  checkAvailable(): void {
    setTimeout(() => {
      for (const course of this.courses) {
        var count = 0;
        //for(const declared of this.declared) {
        // console.log("Course: " + course.name)
        for (const prerequisite of course.prerequisite) {
          // console.log("Prerequisite: " + prerequisite.name)
          const foundDeclared = this.declared.find(x => x.course.id == prerequisite.id);
          const foundPassed = this.passed.find(x => x.course.id == prerequisite.id);
          if (foundDeclared != null || foundPassed != null) {
            // console.log("course: " + course.name);
            // console.log("prerequisite: " + prerequisite.name);
            count++;
          }
        }
        if (count == course.prerequisite.length) {
          course.available = false;
        } else {
          course.available = true;
        }
      }
      this.availableCount = 0;
      for (const course of this.courses) {
        if (!this.existDeclared(course) && !this.existPassed(course) && course.available == false) {
          this.availableCount++;
        }
      }
    }, 500);
  }

  selectCourse(course): void {
    this.selectedCourse = course;
  }

  changeAlert(): void {
    setTimeout(() => {
      this.alert = 0;
    }, 3000);
  }

  finished(): boolean {
    if (this.userEcts >= 240 && this.mandatories >= 18 && this.directionCourses >= 4 && this.specializationCourses >= 4 && this.project >= 1 && this.generalCourses >= 3 && (this.grad_project + this.practice) >= 2) {
      return true;
    }
    return false;
  }

}
