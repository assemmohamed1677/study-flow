import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { task } from '../task.model';
import { Course } from '../../course.model';

@Component({
  selector: 'app-add-task',
  imports: [ReactiveFormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask {
  @Input() courses: Course[] = [];
  @Output() closeTaskForm = new EventEmitter();
  @Output() createTask = new EventEmitter<task>();
  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),

    course: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dueDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    priority: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.getRawValue();
    const chosenCourse = this.courses.find((course) => course.id === formValue.course);

    if (!chosenCourse) {
      return;
    }

    const newTask: task = {
      id: crypto.randomUUID(),
      title: formValue.title,
      description: formValue.description,
      courseId: chosenCourse.id,
      dueDate: formValue.dueDate,
      priority: formValue.priority as task['priority'],
      status: 'OPEN',
    };
    this.createTask.emit(newTask);
  }

  closeForm() {
    this.closeTaskForm.emit();
  }
}
