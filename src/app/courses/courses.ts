import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Course } from '../course.model';
import { ReactiveFormsModule } from '@angular/forms';
import { AddCourses } from './add-courses/add-courses';

@Component({
  selector: 'app-courses',
  imports: [ReactiveFormsModule, AddCourses],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses implements OnInit {
  courses: Course[] = [];
  isAddingCourse: boolean = false;
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedObject = localStorage.getItem('courses');
    if (savedObject) {
      const savedCourses = JSON.parse(savedObject);
      this.courses = savedCourses;
    }
  }

  showAddCourseForum() {
    this.isAddingCourse = true;
  }
  onAddCourse(course: Course) {
    this.courses.push(course);
    this.isAddingCourse = false;

    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem('courses', JSON.stringify(this.courses));
    }
  }
  onDelete(courseId: string) {
    this.courses = this.courses.filter((course) => courseId !== course.id);
    window.localStorage.setItem('courses', JSON.stringify(this.courses));
  }

  onCloseForm() {
    this.isAddingCourse = false;
  }
}
