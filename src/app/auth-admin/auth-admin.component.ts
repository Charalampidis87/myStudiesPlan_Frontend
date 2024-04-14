import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

import {AdminService} from '../admin/admin.service';

@Component({
  selector: 'app-auth-admin',
  templateUrl: './auth-admin.component.html',
  styleUrls: ['./auth-admin.component.css']
})
export class AuthAdminComponent implements OnInit {

  constructor(private router: Router,
              private adminService: AdminService) { }

  authorizeAdmin: String = new String;

  ngOnInit() {

    this.adminService.loginAdmin().subscribe(data => {
      this.authorizeAdmin = data;
      localStorage.setItem('auth', JSON.stringify(this.authorizeAdmin));
    });

    if (localStorage.getItem('auth') !== '"ROLE_ADMIN"') {
      window.location.href = environment.API_URL + '/admin/';
    }

  }

}
