import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {PopoverModule} from 'ngx-popover';

import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './routing/app.routing.module';
import {NgDragDropModule} from 'ng-drag-drop';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { UserComponent } from './user/user.component';
import { AuthComponent } from './auth/auth.component';
import { AdvisorComponent } from './advisor/advisor.component';
import { ProfileComponent } from './profile/profile.component';
import {ChartsModule} from 'ng2-charts';
import {CoursesComponent} from './courses/courses.component';
import {CoursesService} from './courses/courses.service';
import {AdminComponent} from './admin/admin.component';
import {UserService} from './user/user.service';
import { PassedComponent } from './passed/passed.component';
import {AdvisorService} from './advisor/advisor.service';
import { SettingsComponent } from './settings/settings.component';
import { EditcourseComponent } from './admin/editcourse/editcourse.component';
import {XsrfInterceptor} from './interceptors/xsrf.interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthAdminComponent } from './auth-admin/auth-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    AuthComponent,
    AdvisorComponent,
    ProfileComponent,
    CoursesComponent,
    AdminComponent,
    PassedComponent,
    SettingsComponent,
    EditcourseComponent,
    WelcomeComponent,
    AuthAdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgDragDropModule.forRoot(),
    DragAndDropModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    ChartsModule,
    PopoverModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XsrfInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    UserService, CoursesService, AdvisorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
