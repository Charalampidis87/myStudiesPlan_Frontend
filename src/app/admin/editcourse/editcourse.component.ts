import {Component, OnInit} from '@angular/core';
import {User} from '../../user/user';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {FormArray, FormBuilder} from '@angular/forms';
import {CoursesService} from '../../courses/courses.service';
import {Course, CourseSpec, LabProfessor, Professor, Specialization} from '../../courses/course';

@Component({
  selector: 'app-editcourse',
  templateUrl: './editcourse.component.html',
  styleUrls: ['./editcourse.component.css']
})
export class EditcourseComponent implements OnInit {

  constructor(private router: Router,
              private titleService: Title,
              private _fb: FormBuilder,
              private coursesService: CoursesService) {
  }

  user: User = new User();
  selectedCourse: Course = new Course();
  courses: Course[] = [];
  editProfessors: Professor[] = [];
  editLabProfessors: LabProfessor[] = [];
  editPrerequisites: Course[] = [];
  editRecommended: Course[] = [];
  editSpecialization: string[];

  ngOnInit() {
    this.selectedCourse = JSON.parse(localStorage.getItem('course'));
    this.getAdminCourses();
    this.editSpecialization = [];
    for (let i = 1; i < 7; i++) {
      this.editSpecialization.push(null);
    }
    const dummyPre: Course = new Course();
    dummyPre.name = '';
    const dummyRec: Course = new Course();
    dummyPre.name = '';
    const dummySpec: CourseSpec = new CourseSpec();
    dummySpec.specialization = 0;
    dummySpec.type = '';
    if (this.selectedCourse.prerequisite.length == 0) {
      this.selectedCourse.prerequisite.push(dummyPre);
    }
    if (this.selectedCourse.recommended.length == 0) {
      this.selectedCourse.recommended.push(dummyRec);
    }
    if (this.selectedCourse.specialization.length == 0) {
      this.selectedCourse.specialization.push(dummySpec);
    } else {
      for (var k = 1; k < 7; k++) {
        this.editSpecialization[k] = null;
        for (let specialization of this.selectedCourse.specialization) {
          if (specialization.specialization == k) {
            this.editSpecialization[k] = specialization.type;
          }
        }
      }
    }

    let i: any;

    const dummyProf: Professor = new Professor();
    dummyProf.professor = '';
    if (this.selectedCourse.professor.length == 0) {

      this.selectedCourse.professor.push(dummyProf.professor);
    }
    if (this.selectedCourse.professor.length > 0) {
      for (i in this.selectedCourse.professor) {
        let temp: Professor = new Professor();
        temp.professor = this.selectedCourse.professor[i];
        this.editProfessors.push(temp);
      }
    } else {
      this.editProfessors.push(dummyProf);
    }

    const dummyLabProf: LabProfessor = new LabProfessor();
    dummyLabProf.labProfessor = '';
    if (this.selectedCourse.labProfessor.length == 0) {
      this.selectedCourse.labProfessor.push(dummyLabProf.labProfessor);
    }
    if (this.selectedCourse.labProfessor.length > 0) {
      for (i in this.selectedCourse.labProfessor) {
        let temp: LabProfessor = new LabProfessor();
        temp.labProfessor = this.selectedCourse.labProfessor[i];
        this.editLabProfessors.push(temp);
      }
    } else {
      this.editLabProfessors.push(dummyLabProf);
    }

    const dummyPrerequisite: Course = new Course();
    dummyPrerequisite.name = '';
    if (this.selectedCourse.prerequisite.length > 0) {
      for (i in this.selectedCourse.prerequisite) {

        this.editPrerequisites.push(this.selectedCourse.prerequisite[i]);
      }
    } else {
      this.editPrerequisites.push(dummyPrerequisite);
    }

    const dummyRecommended: Course = new Course();
    dummyRecommended.name = '';
    if (this.selectedCourse.recommended.length > 0) {
      for (i in this.selectedCourse.recommended) {

        this.editRecommended.push(this.selectedCourse.recommended[i]);
      }
    } else {
      this.editRecommended.push(dummyRecommended);
    }
  }

  getAdminCourses(): void {
    var a = performance.now();
    this.coursesService.getAdminCourses()
      .subscribe(data => {
        this.courses = data;
        for (const course of this.courses) {
          course.professor = [];
          course.labProfessor = [];
          course.prerequisite = [];
          course.recommended = [];
          course.specialization = [];
        }
      });

    var b = performance.now();
    var time = b - a;
  }

  addEditProfessor() {
    // add professor to the list
    const dummyProf: Professor = new Professor();
    dummyProf.professor = '';
    this.selectedCourse.professor.push('');

    this.editProfessors.push(dummyProf);
  }

  addEditLabProfessor() {
    // add lab professor to the list
    const dummyLabProf: LabProfessor = new LabProfessor();
    dummyLabProf.labProfessor = '';
    this.editLabProfessors.push(dummyLabProf);
  }

  addEditPrerequisite() {
    const dummy: Course = new Course();
    dummy.name = '';
    this.selectedCourse.prerequisite.push(dummy);

    this.editPrerequisites.push(dummy);
  }

  addEditRecommended() {
    const dummy: Course = new Course();
    dummy.name = '';
    this.selectedCourse.recommended.push(dummy);
    this.editRecommended.push(dummy);
  }

  removeEditProfessor(i: number) {
    // remove professor from the list

    this.editProfessors.splice(i, 1);


  }

  removeEditLabProfessor(i: number) {
    // remove lab professor from the list

    this.editLabProfessors.splice(i, 1);
  }

  removeEditPrerequisite(i: number) {
    this.editPrerequisites.splice(i, 1);
  }

  removeEditRecommended(i: number) {
    this.editRecommended.splice(i, 1);
  }

  deleteCourse(course): void {
    this.coursesService.deleteCourse(course)
      .subscribe(
        successResponse => {
          alert(successResponse);
          this.router.navigate(['/admin/']);
          }, errorResponse => {
          alert(errorResponse.error);
        });
  }

  cancelEditCourse(): void {
    this.editSpecialization = [];
    this.editProfessors = [];
    this.editLabProfessors = [];
    this.editPrerequisites = [];
    this.editRecommended = [];
  }

  editCourse(): void {
    const editPreCourses: string[] = [];
    const editRecCourses: string[] = [];
    const specializations: CourseSpec[] = [];
    var tempSpec: CourseSpec = new CourseSpec();
    let i: any;
    let j: any;
    for (i in this.editPrerequisites) {
      for (j in this.courses) {
        if (this.courses[j].name == this.editPrerequisites[i].name) {
          editPreCourses.push(this.courses[j].name);
        }
      }
    }
    for (i in this.editRecommended) {
      for (j in this.courses) {
        if (this.courses[j].name == this.editRecommended[i].name) {
          editRecCourses.push(this.courses[j].name);
        }
      }
    }
    for (i in this.editSpecialization) {
      if (this.editSpecialization[i] != null) {
        tempSpec.specialization = i;
        tempSpec.type = this.editSpecialization[i];

        specializations.push(tempSpec);
        tempSpec = new CourseSpec();
      }
    }
    if (this.selectedCourse.theory == null) {
      this.selectedCourse.theory = 0;
    }
    if (this.selectedCourse.extra == null) {
      this.selectedCourse.extra = 0;
    }
    if (this.selectedCourse.lab == null) {
      this.selectedCourse.lab = 0;
    }
    this.coursesService.editCourse(this.selectedCourse.id, this.selectedCourse.name, this.selectedCourse.code, this.selectedCourse.ects, this.selectedCourse.semester,
      this.selectedCourse.type, this.selectedCourse.direction, JSON.stringify(specializations), this.selectedCourse.theory, this.selectedCourse.extra, this.selectedCourse.lab,
      JSON.stringify(this.editProfessors), JSON.stringify(this.editLabProfessors),
      JSON.stringify(editPreCourses), JSON.stringify(editRecCourses), this.selectedCourse.double_exam, this.selectedCourse.offered)
      .subscribe(successResponse => {
        alert(successResponse);
        this.editSpecialization = [];
        this.editProfessors = [];
        this.editLabProfessors = [];
        this.editPrerequisites = [];
        this.editRecommended = [];
        this.router.navigate(['/admin/']);

      }, errorResponse => {
        alert(errorResponse.error);
      });
  }

  logout(): void {
    localStorage.clear();
  }

}
