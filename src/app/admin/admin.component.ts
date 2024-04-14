import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  Course,
  CourseSpec,
  LabProfessor,
  Prerequisite,
  Professor,
  Recommended,
  Specialization
} from '../courses/course';
import {CoursesService} from '../courses/courses.service';
import {Title} from '@angular/platform-browser';
import {User} from '../user/user';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../user/user.service';
import {AdminService} from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {



  constructor(private router: Router,
              private titleService: Title,
              private _fb: FormBuilder,
              private coursesService: CoursesService,
              private http: HttpClient,
              private userService: UserService,
              private adminService: AdminService) {
  }
  authorizeAdmin: String = new String;
  user: User = new User();
  newCourseName: String = new String;
  newCourseCode: String = new String;
  newCourseEcts: number;
  newCourseSemester: number;
  newCourseType: String = new String;
  newCourseDirection: String = new String;
  newCourseSpecialization: string[];
  newCourseTheory: number;
  newCourseExtra: number;
  newCourseLab: number;
  newCourseOffered: boolean;
  newCourseDoubleExam: boolean;
  editSpecialization: string[];
  selectedCourse: Course = new Course();
  courseForm: any;
  professor: Professor[];
  professors: Professor[];
  labProfessors: LabProfessor[];
  prerequisites: Prerequisite[];
  recommended: Recommended [];
  specializations: Specialization[];
  editForm: any;
  ects: number = null;
  semester: number = null;
  courses: Course[];
  editProfessors: Professor[] = [];
  editLabProfessors: LabProfessor[] = [];
  editPrerequisites: Course[] = [];
  editRecommended: Course[] = [];


  ngOnInit() {
    this.titleService.setTitle('Διαχειριστής');

    this.getAdminCourses();
    this.getProfessors();
    this.getLabProfessors();
    this.getPrerequisites();
    this.getRecommended();
    this.getSpecializations();
    this.courseForm = this._fb.group({
      professors: this._fb.array([
        this.initProfessor()
      ]),
      labProfessors: this._fb.array([
        this.initLabProfessor()
      ]),
      prerequisites: this._fb.array([
        this.initPrerequisite()
      ]),
      recommended: this._fb.array([
        this.initRecommended()
      ])
    });

    this.newCourseOffered = true;
    this.newCourseDoubleExam = false;
    this.newCourseSpecialization = [];
    this.editSpecialization = [];
    for (let i = 1; i < 7; i++) {
      this.editSpecialization.push(null);
    }
    this.specializations = [];
  }

  initProfessor() {
    // initialize our professors
    return this._fb.group({
      professor: ['', Validators.required],
    });
  }

  initLabProfessor() {
    // initialize our professors
    return this._fb.group({
      labProfessor: ['', Validators.required],
    });
  }

  initPrerequisite() {
    // initialize our professors
    return this._fb.group({
      prerequisite: ['', Validators.required],
    });
  }

  initRecommended() {
    // initialize our professors
    return this._fb.group({
      recommended: ['', Validators.required],
    });
  }

  initEditProfessor() {
    return this._fb.group({
      professor: ['', Validators.required],
    });
  }

  initEditLabProfessor() {
    return this._fb.group({
      labProfessor: ['', Validators.required],
    });
  }

  initEditPrerequisite() {
    return this._fb.group({
      prerequisite: ['', Validators.required],
    });
  }

  initEditRecommended() {
    return this._fb.group({
      recommended: ['', Validators.required],
    });
  }

  addProfessor() {
    // add professor to the list
    const control = <FormArray>this.courseForm.controls['professors'];
    control.push(this.initProfessor());
  }

  addLabProfessor() {
    // add professor to the list
    const control = <FormArray>this.courseForm.controls['labProfessors'];
    control.push(this.initLabProfessor());
  }

  addPrerequisite() {
    // add professor to the list
    const control = <FormArray>this.courseForm.controls['prerequisites'];
    control.push(this.initPrerequisite());
  }

  addRecommended() {
    // add professor to the list
    const control = <FormArray>this.courseForm.controls['recommended'];
    control.push(this.initRecommended());
  }

  addEditProfessor() {
    // add professor to the list
    // const control = <FormArray>this.editForm.controls['editProfessors'];
    // control.push(this.initEditProfessor());
    const dummyProf: Professor = new Professor();
    dummyProf.professor = '';
    this.selectedCourse.professor.push('');

    this.editProfessors.push(dummyProf);
  }

  addEditLabProfessor() {
    // add professor to the list
    // const control = <FormArray>this.editForm.controls['editLabProfessors'];
    // control.push(this.initEditLabProfessor());
    const dummyLabProf: LabProfessor = new LabProfessor();
    dummyLabProf.labProfessor = '';
    this.editLabProfessors.push(dummyLabProf);
  }

  addEditPrerequisite() {
    const dummy: Course = new Course();
    dummy.name = '';
    this.selectedCourse.prerequisite.push(dummy);
    // add professor to the list
    // const control = <FormArray>this.editForm.controls['editPrerequisites'];
    // control.push(this.initEditPrerequisite());

    this.editPrerequisites.push(dummy);
  }

  addEditRecommended() {
    const dummy: Course = new Course();
    dummy.name = '';
    this.selectedCourse.recommended.push(dummy);
    // add professor to the list
    // const control = <FormArray>this.editForm.controls['editRecommended'];
    // control.push(this.initEditRecommended());
    this.editRecommended.push(dummy);
  }

  removeProfessor(i: number) {
    // remove professor from the list
    const control = <FormArray>this.courseForm.controls['professors'];
    control.removeAt(i);
  }

  removeLabProfessor(i: number) {
    // remove professor from the list
    const control = <FormArray>this.courseForm.controls['labProfessors'];
    control.removeAt(i);
  }

  removePrerequisite(i: number) {
    // remove professor from the list
    const control = <FormArray>this.courseForm.controls['prerequisites'];
    control.removeAt(i);
  }

  removeRecommended(i: number) {
    // remove professor from the list
    const control = <FormArray>this.courseForm.controls['recommended'];
    control.removeAt(i);
  }

  removeEditProfessor(i: number) {
    // remove professor from the list
    const control = <FormArray>this.editForm.controls['editProfessors'];
    control.removeAt(i);
  }

  removeEditLabProfessor(i: number) {
    // remove professor from the list
    const control = <FormArray>this.editForm.controls['editLabProfessors'];
    control.removeAt(i);
  }

  removeEditPrerequisite(i: number) {
    // remove professor from the list
    const control = <FormArray>this.editForm.controls['editPrerequisites'];
    control.removeAt(i);
  }

  removeEditRecommended(i: number) {
    // remove professor from the list
    const control = <FormArray>this.editForm.controls['editRecommended'];
    control.removeAt(i);
  }

  selectCourse(course): void {
    this.selectedCourse = course;
    localStorage.setItem('course', JSON.stringify(this.selectedCourse));
  }

  createCourse(): void {
    const preCourses: string[] = [];
    const recCourses: string[] = [];
    const specializations: CourseSpec[] = [];
    var tempSpec: CourseSpec = new CourseSpec();
    let i: any;
    let j: any;
    for (i in this.courseForm.controls['prerequisites'].value) {
      for (j in this.courses) {
        if (this.courses[j].name == this.courseForm.controls['prerequisites'].value[i].prerequisite) {
          preCourses.push(this.courses[j].name);
        }
      }
    }
    for (i in this.courseForm.controls['recommended'].value) {
      for (j in this.courses) {
        if (this.courses[j].name == this.courseForm.controls['recommended'].value[i].recommended) {
          recCourses.push(this.courses[j].name);
        }
      }
    }
    for (i in this.newCourseSpecialization) {
      if (this.newCourseSpecialization[i] != null) {
        tempSpec.specialization = i;
        tempSpec.type = this.newCourseSpecialization[i];

        specializations.push(tempSpec);
        tempSpec = new CourseSpec();
      }
    }
    if (this.newCourseTheory == null) {
      this.newCourseTheory = 0;
    }
    if (this.newCourseExtra == null) {
      this.newCourseExtra = 0;
    }
    if (this.newCourseLab == null) {
      this.newCourseLab = 0;
    }
    this.coursesService.createCourse(this.newCourseName, this.newCourseCode, this.newCourseEcts, this.newCourseSemester,
      this.newCourseType, this.newCourseDirection, JSON.stringify(specializations),
      this.newCourseTheory, this.newCourseExtra, this.newCourseLab, JSON.stringify(this.courseForm.controls['professors'].value),
      JSON.stringify(this.courseForm.controls['labProfessors'].value), JSON.stringify(preCourses), JSON.stringify(recCourses), this.newCourseDoubleExam, this.newCourseOffered)
      .subscribe(successResponse => {
        alert(successResponse);
        this.newCourseName = new String;
        this.newCourseCode = new String;
        this.newCourseEcts = null;
        this.newCourseSemester = null;
        this.newCourseType = new String;
        this.newCourseDirection = new String;
        this.newCourseSpecialization = [];
        this.newCourseTheory = null;
        this.newCourseExtra = null;
        this.newCourseLab = null;
        this.newCourseDoubleExam = false;
        this.newCourseOffered = true;
        this.newCourseSpecialization = [];
        this.courseForm = this._fb.group({
          professors: this._fb.array([
            this.initProfessor(),
          ]),
          labProfessors: this._fb.array([
            this.initLabProfessor(),
          ]),
          prerequisites: this._fb.array([
            this.initPrerequisite(),
          ]),
          recommended: this._fb.array([
            this.initRecommended(),
          ])
        });
        this.getAdminCourses();
        this.getProfessors();
        this.getLabProfessors();
        this.getPrerequisites();
        this.getRecommended();
        this.getSpecializations();

      }, errorResponse => {
        alert(errorResponse.error);
      });

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

        this.getAdminCourses();
        this.getProfessors();
        this.getLabProfessors();
        this.getPrerequisites();
        this.getRecommended();
        this.getSpecializations();

      }, errorResponse => {
        alert(errorResponse.error);
      });
  }

  getAdminCourses(): void {
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

  }

  getProfessors(): void {
    setTimeout(() => {
      this.coursesService.getProfessors()
        .subscribe(data => {
          this.professors = data;
          for (const professor of this.professors) {
            for (const course of this.courses) {
              if (professor.course.id === course.id) {
                course.professor.push(professor.professor);

              }
            }
          }

          if (this.professors == null) {
            const control = <FormArray>this.editForm.controls['editProfessors'];
            control.push(this.initEditProfessor());
          }


        });
    }, 100);
  }

  getLabProfessors(): void {
    setTimeout(() => {
      this.coursesService.getLabProfessors()
        .subscribe(data => {
          this.labProfessors = data;
          for (const labProfessor of this.labProfessors) {
            for (const course of this.courses) {
              if (labProfessor.course.id === course.id) {
                course.labProfessor.push(labProfessor.labProfessor);

              }
            }
          }
        });
    }, 400);
  }

  getPrerequisites(): void {
    setTimeout(() => {
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
    }, 300);
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
        for (const specialization of this.specializations) {
          for (const course of this.courses) {
            if (specialization.course.id === course.id) {
              var tempSpec = new CourseSpec();
              tempSpec.type = specialization.type;
              tempSpec.specialization = specialization.specialization;
              course.specialization.push(tempSpec);

            }
          }
        }


      });
  }

  cancelAddCourse(): void {
    this.newCourseName = new String;
    this.newCourseCode = new String;
    this.newCourseEcts = null;
    this.newCourseSemester = null;
    this.newCourseType = new String;
    this.newCourseDirection = new String;
    this.newCourseSpecialization = [];
    this.newCourseTheory = null;
    this.newCourseExtra = null;
    this.newCourseLab = null;
    this.newCourseDoubleExam = false;
    this.newCourseOffered = true;
    this.newCourseSpecialization = [];
    this.courseForm = this._fb.group({
      professors: this._fb.array([
        this.initProfessor(),
      ]),
      labProfessors: this._fb.array([
        this.initLabProfessor(),
      ]),
      prerequisites: this._fb.array([
        this.initPrerequisite(),
      ]),
      recommended: this._fb.array([
        this.initRecommended(),
      ])
    });
  }

  cancelEditCourse(): void {
    this.editSpecialization = [];
    this.editForm = this._fb.group({
      editProfessors: this._fb.array([]),
      editLabProfessors: this._fb.array([]),
      editPrerequisites: this._fb.array([]),
      editRecommended: this._fb.array([])
    });
    this.editProfessors = [];
    this.editLabProfessors = [];
    this.editPrerequisites = [];
    this.editRecommended = [];
  }

  deleteCourse(course): void {
    this.coursesService.deleteCourse(course)
      .subscribe(
        successResponse => {
          alert(successResponse);
          this.getAdminCourses();
          this.getProfessors();
          this.getLabProfessors();
          this.getPrerequisites();
          this.getRecommended();
        }, errorResponse => {
          alert(errorResponse.error);
        });
  }

  logout(): void {
    this.http.post<void>(environment.API_URL + '/logout', {}).subscribe();
    localStorage.clear();
  }
}
