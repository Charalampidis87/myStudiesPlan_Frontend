import {User} from '../user/user';
import {Course} from '../courses/course';

export class Passed {
  id: number;
  user: User;
  course: Course;
  year: number;
  examination: number;
  grade: number;
  available: boolean;
}
