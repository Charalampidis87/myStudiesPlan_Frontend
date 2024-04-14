import {Component, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from '../user/user.component';
import {AuthComponent} from '../auth/auth.component';
import {AdvisorComponent} from '../advisor/advisor.component';
import {ProfileComponent} from '../profile/profile.component';
import {CoursesComponent} from '../courses/courses.component';
import {AdminComponent} from '../admin/admin.component';
import {PassedComponent} from '../passed/passed.component';
import {SettingsComponent} from '../settings/settings.component';
import {EditcourseComponent} from '../admin/editcourse/editcourse.component';
import {WelcomeComponent} from '../welcome/welcome.component';
import {AuthAdminComponent} from '../auth-admin/auth-admin.component';

const routes: Routes = [
  {path: '', component: WelcomeComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'logadmin', component: AuthAdminComponent},
  {path: 'user', component: UserComponent},
  {path: 'advisor', component: AdvisorComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'courses', component: CoursesComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'passed', component: PassedComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'editcourse', component: EditcourseComponent}
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule {
}
