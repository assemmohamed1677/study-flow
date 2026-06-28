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
    this.loadCourses();
    this.isAddingTask = true;
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadTasks();
  }

  private loadCourses() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedCourses = window.localStorage.getItem('courses');
    if (savedCourses) {
      const correctTypeCourses = JSON.parse(savedCourses);
      this.courses = correctTypeCourses;
    } else {
      this.courses = [];
    }
  }

  onCreateTask(addedTask: task) {
    this.tasks.push(addedTask);
    this.isAddingTask = false;
    this.saveTasks();
    console.log(this.tasks);
  }

  closeForm() {
    this.isAddingTask = false;
  }

  onCompleteTask(completedTask: task) {
    completedTask.status = 'DONE';
    this.saveTasks();
  }

  onDeleteTask(deletedTask: task) {
    this.tasks = this.tasks.filter((task) => task.id !== deletedTask.id);
    this.saveTasks();
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

  private saveTasks() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
