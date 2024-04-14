import {User} from "../user/user";

export class Advisor {
  id: number;
  name: string;
  user: User;
  active: boolean;
  active_year: number;
  active_examination: number;
  years: number;
}
