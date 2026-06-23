import { Component } from '@angular/core';
import { SideBar } from './side-bar/side-bar';

@Component({
  selector: 'app-dash-board',
  imports: [SideBar],
  templateUrl: './dash-board.html',
  styleUrl: './dash-board.css',
})
export class DashBoard {}
