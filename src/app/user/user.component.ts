import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "./user";
import {UserService} from "./user.service";
import {Title} from "@angular/platform-browser";
import {environment} from '../../environments/environment';
import {AdminService} from '../admin/admin.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: User[] = [];
  loginUser: User;
  currentPage: number;
  pageUsers: User[] = [];
  allPages: number;
  allPagesArr: number[] = [];
  nearPages: number[] = [];
  numOfShowUsers = 5;
  selectedUser: User = new User();

  constructor(private router: Router,
              private titleService: Title,
              private userService: UserService,
              private adminService: AdminService) {
  }

  ngOnInit() {
    this.titleService.setTitle("Διαχειριστής-Χρήστες");
    this.loginUser = JSON.parse(localStorage.getItem("user"));
    this.getUsers();
    this.currentPage = 1;

    setTimeout(() => {
      for(var i = 0; i < this.allPages; i++){
        this.allPagesArr[i] = i+1;
      }
      this.getPageUsers(this.currentPage);
      this.nearPages = [1,2,3,4,5];
    }, 500);

  }

  getUsers(): void {
    this.adminService.getUsers()
      .subscribe(data => {
        this.users = data;
        this.allPages = this.users.length / this.numOfShowUsers;
      });
  }

  getPageUsers(page): void {
      this.pageUsers = [];
      var i: number;
      var j: number;
      for (i = (page * this.numOfShowUsers) - this.numOfShowUsers; i < page * this.numOfShowUsers; i++) {
        if (i < this.users.length) {
          this.pageUsers[i % this.numOfShowUsers] = this.users[i];
        }
      }
  }

  changePage(page): void {
    this.currentPage = page;
    this.getPageUsers(this.currentPage);
  }

  previous(): void {
    if(this.currentPage > 1) {
      this.currentPage--;
      this.getPageUsers(this.currentPage);
    }
    if(this.currentPage == 1 || this.currentPage == 2 || this.currentPage == 3) {
      this.nearPages = [1,2,3,4,5,6];
    } else if (this.currentPage == this.allPagesArr.length || this.currentPage == this.allPagesArr.length-1 || this.currentPage == this.allPagesArr.length-2) {
      this.nearPages = [this.allPagesArr.length-5, this.allPagesArr.length-4, this.allPagesArr.length-3, this.allPagesArr.length-2, this.allPagesArr.length-1, this.allPagesArr.length]
    } else {
      this.nearPages = [this.currentPage-2, this.currentPage-1, this.currentPage, this.currentPage+1, this.currentPage+2];
    }
  }

  next(): void {
    if(this.currentPage < this.allPages) {
      this.currentPage++;
      this.getPageUsers(this.currentPage);
    }
    if(this.currentPage == 1 || this.currentPage == 2 || this.currentPage == 3) {
      this.nearPages = [1,2,3,4,5,6];
    } else if (this.currentPage == this.allPagesArr.length || this.currentPage == this.allPagesArr.length-1 || this.currentPage == this.allPagesArr.length-2) {
      this.nearPages = [this.allPagesArr.length-5, this.allPagesArr.length-4, this.allPagesArr.length-3, this.allPagesArr.length-2, this.allPagesArr.length-1, this.allPagesArr.length]
    } else {
      this.nearPages = [this.currentPage-2, this.currentPage-1, this.currentPage, this.currentPage+1, this.currentPage+2];
    }
    console.log(this.numOfShowUsers);
  }

  first(): void {
    this.currentPage = 1;
    this.getPageUsers(this.currentPage);
    if(this.currentPage == 1 || this.currentPage == 2 || this.currentPage == 3) {
      this.nearPages = [1,2,3,4,5,6];
    } else if (this.currentPage == this.allPagesArr.length || this.currentPage == this.allPagesArr.length-1 || this.currentPage == this.allPagesArr.length-2) {
      this.nearPages = [this.allPagesArr.length-5, this.allPagesArr.length-4, this.allPagesArr.length-3, this.allPagesArr.length-2, this.allPagesArr.length-1, this.allPagesArr.length]
    } else {
      this.nearPages = [this.currentPage-2, this.currentPage-1, this.currentPage, this.currentPage+1, this.currentPage+2];
    }
  }

  last(): void {
    this.currentPage = this.allPagesArr.length;
    this.getPageUsers(this.currentPage);
    if(this.currentPage == 1 || this.currentPage == 2 || this.currentPage == 3) {
      this.nearPages = [1,2,3,4,5,6];
    } else if (this.currentPage == this.allPagesArr.length || this.currentPage == this.allPagesArr.length-1 || this.currentPage == this.allPagesArr.length-2) {
      this.nearPages = [this.allPagesArr.length-5, this.allPagesArr.length-4, this.allPagesArr.length-3, this.allPagesArr.length-2, this.allPagesArr.length-1, this.allPagesArr.length]
    } else {
      this.nearPages = [this.currentPage-2, this.currentPage-1, this.currentPage, this.currentPage+1, this.currentPage+2];
    }
  }

  deleteUser(user): void {
    this.adminService.deleteUser(user)
      .subscribe(
        successResponse => {
          this.getUsers();
          setTimeout(() => {
            // for(var i = 0; i < this.allPages; i++){
            //   this.allPagesArr[i] = i+1;
            // }
            this.getPageUsers(this.currentPage);
            if (this.pageUsers.length == 0) {
              if (this.currentPage != 1) {
                this.currentPage--;
                this.getPageUsers(this.currentPage);
              }
            }
            for(var i = 0; i < this.allPages; i++){
              this.allPagesArr[i] = i+1;
            }
          }, 500);
          alert(successResponse);
        }, errorResponse => {
          alert(errorResponse);
        });
  }

  selectUser(user): void {
    this.selectedUser = user;
  }

  logout(): void {
    this.userService.logout();
    localStorage.clear();
    window.location.href = environment.CAS_LOGOUT_URL;
  }


}
