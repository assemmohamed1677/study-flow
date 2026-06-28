import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { task } from '../tasks/task.model';
import { Course } from '../course.model';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-dash-board',

  templateUrl: './dash-board.html',
  styleUrl: './dash-board.css',
  imports: [RouterLinkActive, RouterLinkWithHref],
})
export class DashBoard implements OnInit {
  tasks: task[] = [];
  courses: Course[] = [];
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.loadTasks();
    this.loadCourses();
  }

  private loadTasks() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedTasks = window.localStorage.getItem('tasks');
    if (savedTasks) {
      const loadedTasks = JSON.parse(savedTasks);
      this.tasks = loadedTasks;
    } else {
      this.tasks = [];
    }
  }

  private loadCourses() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedCourses = window.localStorage.getItem('courses');
    if (savedCourses) {
      const loadedCourses = JSON.parse(savedCourses);
      this.courses = loadedCourses;
    } else {
      this.courses = [];
    }
  }

  get pendingTasks() {
    return this.tasks.filter((task) => task.status !== 'DONE').length;
  }

  get completedTasks() {
    return this.tasks.filter((task) => task.status == 'DONE').length;
  }
}
