import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { task } from './task.model';
import { AddTask } from './add-task/add-task';
import { Course } from '../course.model';

@Component({
  selector: 'app-tasks',
  imports: [AddTask],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  courses: Course[] = [];
  tasks: task[] = [];
  isAddingTask = false;
  private platformId = inject(PLATFORM_ID);

  onAddingTask() {
    this.isAddingTask = true;
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedCourses = window.localStorage.getItem('courses');
    if (savedCourses) {
      const correctTypeCourses = JSON.parse(savedCourses);
      this.courses = correctTypeCourses;
      console.log(this.courses);
    }
  }

  onCreateTask(addedTask: task) {
    this.tasks.push(addedTask);
    console.log(this.tasks);
  }
}
