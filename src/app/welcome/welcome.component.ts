import {Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {AdminService} from '../admin/admin.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})

export class WelcomeComponent implements OnInit {

  authorization: String = new String;

  constructor(private titleService: Title,
              private router: Router,
              private adminService: AdminService) {}

  ngOnInit() {
    this.titleService.setTitle('myStudiesPlan');

    // this.adminService.loginAdmin().subscribe(data => {
    //   this.authorization = data;
    //   localStorage.setItem('authorization', JSON.stringify(this.authorization));
    // });
    // console.log(localStorage.getItem('authorization'));
    // if (localStorage.getItem('authorization') === '"ROLE_ADMIN"') {
    //   this.router.navigate(['/admin']);
    // }
    // if (localStorage.getItem('authorization') === '"ROLE_USER"') {
    //   this.router.navigate(['/auth']);
    // }
  }

  login(): void {
    window.location.href = environment.CAS_LOGIN_URL;
  }

}
