import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user/user';
import {UserService} from '../user/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  user: User = new User();

  constructor(private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.login().subscribe(data => {
      this.user = data;
      localStorage.setItem('user', JSON.stringify(this.user));
      this.router.navigate(['/advisor']);
    });
  }
}
