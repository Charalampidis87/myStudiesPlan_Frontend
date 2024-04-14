import {User} from '../user/user';

export class Course {
  id: number;
  name: string;
  code: string;
  ects: number;
  semester: number;
  direction: string;
  // specialization1: string;
  // specialization2: string;
  // specialization3: string;
  // specialization4: string;
  // specialization5: string;
  // specialization6: string;
  specialization:  CourseSpec[];
  type: string;
  professor: string[];
  labProfessor: string[];
  prerequisite: Course[];
  recommended: Course[];
  theory: number;
  extra: number;
  lab: number;
  grade: number;
  gradeGoal: number;
  available: boolean;
  double_exam: boolean;
  offered: boolean;
}

export class Professor {
  id: number;
  course: Course;
  professor: string;
}

export class LabProfessor {
  id: number;
  course: Course;
  labProfessor: string;
}

export class Prerequisite {
  id: number;
  course: Course;
  prerequisite: Course;
}

export class Recommended {
  id: number;
  course: Course;
  recommended: Course;
}

export class Declared {
  id: number;
  user: User;
  grade: number;
  course: Course;
  year: number;
  examination: number;
  advisor: number;
  gradegoal: number;
  passed: boolean;
  prerequisites: Course[];
  available: boolean;
}

export class Specialization {
  id: number;
  course: Course;
  specialization: number;
  type: string;
}

export class CourseSpec {
  specialization: number;
  type: string;
}
