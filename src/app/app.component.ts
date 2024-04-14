import { Component, NgModule } from '@angular/core';
import {Router} from '@angular/router';
// import {DropEvent} from 'angular-draggable-droppable';
import {DropEvent} from 'ng-drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myStudiesPlan';

  constructor(private router: Router) {
  }
}
