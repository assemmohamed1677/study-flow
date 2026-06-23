import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course } from '../../course.model';

@Component({
  selector: 'app-add-courses',
  imports: [ReactiveFormsModule],
  templateUrl: './add-courses.html',
  styleUrl: './add-courses.css',
})
export class AddCourses {
  @Output() close = new EventEmitter();
  @Output() addCourse = new EventEmitter<Course>();
  form = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required, Validators.minLength(4)],
    }),
    description: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  onSubmit() {
    const colorArray = ['cyan', 'green', 'purple', 'amber', 'rose'];
    const selectedColor = colorArray[Math.floor(Math.random() * 5)];
    const uuid = crypto.randomUUID();
    if (this.form.value.title && this.form.value.description) {
      const newCourse: Course = {
        id: uuid,
        title: this.form.value.title,
        description: this.form.value.description,
        progress: '0%',
        color: selectedColor,
      };
      this.addCourse.emit(newCourse);
    }
  }

  closeForm() {
    this.close.emit();
  }
}
