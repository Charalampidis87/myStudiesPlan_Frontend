import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Course, Declared, LabProfessor, Prerequisite, Professor, Recommended, Specialization} from './course';
import {Passed} from '../passed/passed';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) {
  }

  private apiUrl = environment.API_URL;
  private courseUrl = environment.API_URL + '/course';
  private adminUrl = environment.API_URL + '/admin/';
  private editCourseUrl = environment.API_URL + '/course/edit';

  public getDeclared() {
    return this.http.get<Declared[]>(this.courseUrl + '/getdeclared');
  }

  public getGradeGoals() {
    return this.http.get<number[]>(this.courseUrl + '/getgradegoals');
  }

  public createPassedCourse(courseId, examination, grade, year) {
    const postRequestParameters = new FormData();
    postRequestParameters.append('courseId', courseId);
    postRequestParameters.append('examination', examination);
    postRequestParameters.append('grade', grade);
    postRequestParameters.append('year', year);
    return this.http.post<String>(this.courseUrl + '/createpassed', postRequestParameters);
  }

  public addDeclaredGrade(courseId, examination, grade, year) {
    const postRequestParameters = new FormData();

    postRequestParameters.append('courseId', courseId);
    postRequestParameters.append('examination', examination);
    postRequestParameters.append('grade', grade);
    postRequestParameters.append('year', year);
    return this.http.post<String>(this.courseUrl + '/addDeclaredGrade', postRequestParameters);
  }

  public addPassedGrade(courseId, examination, grade, year) {
    const postRequestParameters = new FormData();

    postRequestParameters.append('courseId', courseId);
    postRequestParameters.append('examination', examination);
    postRequestParameters.append('grade', grade);
    postRequestParameters.append('year', year);

    return this.http.post<String>(this.courseUrl + '/addPassedGrade', postRequestParameters);
  }

  public createCourse(name, code, ects, semester, type, direction, specialization,
                      theory, extra, lab, professor, labProfessor, prerequisite, recommended, double_exam, offered) {
    const postRequestParameters = new FormData();

    postRequestParameters.append('name', name);
    postRequestParameters.append('code', code);
    postRequestParameters.append('ects', ects);
    postRequestParameters.append('semester', semester);
    postRequestParameters.append('type', type);
    postRequestParameters.append('direction', direction);
    postRequestParameters.append('specialization', specialization);
    postRequestParameters.append('theory', theory);
    postRequestParameters.append('extra', extra);
    postRequestParameters.append('lab', lab);
    postRequestParameters.append('professor', professor);
    postRequestParameters.append('labProfessor', labProfessor);
    postRequestParameters.append('prerequisite', prerequisite);
    postRequestParameters.append('recommended', recommended);
    postRequestParameters.append('double_exam', double_exam);
    postRequestParameters.append('offered', offered);

    return this.http.post<String>(this.adminUrl + 'createCourse', postRequestParameters);
  }

  public editCourse(id, name, code, ects, semester, type, direction, specialization,
                    theory, extra, lab, professor, labProfessor, prerequisite, recommended, double_exam, offered) {
    const postRequestParameters = new FormData();
    postRequestParameters.append('id', id);
    postRequestParameters.append('name', name);
    postRequestParameters.append('code', code);
    postRequestParameters.append('ects', ects);
    postRequestParameters.append('semester', semester);
    postRequestParameters.append('type', type);
    postRequestParameters.append('direction', direction);
    postRequestParameters.append('specialization', specialization);
    postRequestParameters.append('theory', theory);
    postRequestParameters.append('extra', extra);
    postRequestParameters.append('lab', lab);
    postRequestParameters.append('professor', professor);
    postRequestParameters.append('labProfessor', labProfessor);
    postRequestParameters.append('prerequisite', prerequisite);
    postRequestParameters.append('recommended', recommended);
    postRequestParameters.append('double_exam', double_exam);
    postRequestParameters.append('offered', offered);

    return this.http.post<String>(this.adminUrl + 'editCourse', postRequestParameters);
  }

  public getCourses() {
    return this.http.get<Course[]>(this.courseUrl);
  }

  public getAdminCourses() {
    return this.http.get<Course[]>(this.adminUrl + 'adminCourses');
  }

  public getPassed() {
    return this.http.get<Passed[]>(this.courseUrl + '/getpassed');
  }

  public deleteDeclaredCourse(courseId) {
    let params = new HttpParams()
      .set('courseId', courseId);
    return this.http.delete(this.courseUrl + '/deletedeclared', {params: params});
  }

  public deletePassedCourse(courseId) {
    let params = new HttpParams()
      .set('courseId', courseId);

    return this.http.delete(this.courseUrl + '/deletepassed', {params: params});
  }

  public createGradeGoal(courseId, gradeGoal) {
    const postRequestParameters = new FormData();

    postRequestParameters.append('courseId', courseId);
    postRequestParameters.append('gradeGoal', gradeGoal);
    return this.http.post<String>(this.courseUrl + '/creategradegoal', postRequestParameters);

  }

  public getProfessors() {
    return this.http.get<Professor[]>(this.courseUrl + '/professors');
  }

  public getLabProfessors() {
    return this.http.get<LabProfessor[]>(this.courseUrl + '/labprofessors');
  }

  public getPrerequisites() {
    return this.http.get<Prerequisite[]>(this.courseUrl + '/prerequisites');
  }

  public getRecommended() {
    return this.http.get<Recommended[]>(this.courseUrl + '/recommended');
  }

  public getSpecializations() {
    return this.http.get<Specialization[]>(this.courseUrl + '/specializations');
  }

  public getAvailable(year, examination) {
    let params = new HttpParams()
      .set('year', year)
      .set('examination', examination);

    return this.http.get<Course[]>(this.courseUrl + '/available', {params: params});
  }

  public declare(year, examination, courses) {
    const postRequestParameters = new FormData();

    postRequestParameters.append('year', year);
    postRequestParameters.append('examination', examination);
    postRequestParameters.append('courses', courses);
    return this.http.post<String>(this.courseUrl + '/declare', postRequestParameters);
  }

  public passDeclared(year, examination) {

    const postRequestParameters = new FormData();

    postRequestParameters.append('year', year);
    postRequestParameters.append('examination', examination);

    return this.http.post<String>(this.courseUrl + '/passDeclared', postRequestParameters);

  }

  public fromPassedToDeclared(year, examination){
    const postRequestParameters = new FormData();

    postRequestParameters.append('year', year);
    postRequestParameters.append('examination', examination);

    return this.http.post<String>(this.courseUrl + '/passedToDeclared', postRequestParameters);
  }

  public getUserCourses() {
        return this.http.get<Course[]>(this.courseUrl + '/getUserCourses');
  }

  public deleteCourse(course) {
    return this.http.delete(this.adminUrl + 'deleteCourse' + course.id);
  }

  public logout() {
    this.http.post<void>(this.apiUrl + '/logout', {}).subscribe();
  }
}
