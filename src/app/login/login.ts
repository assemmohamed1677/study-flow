import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

function hasTen(control: AbstractControl) {
  return control.value?.length > 10 ? null : { isLessTen: true };
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), hasTen]
    })
  });

  get emailInvalid() {
    return (
      this.form.controls.email.invalid &&
      this.form.controls.email.dirty &&
      this.form.controls.email.touched
    );
  }

  get passwordInvalid() {
    return (
      this.form.controls.password.invalid &&
      this.form.controls.password.dirty &&
      this.form.controls.password.touched
    );
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedForm = localStorage.getItem('saved-form');

    if (savedForm) {
      const savedObject = JSON.parse(savedForm);

      this.form.patchValue({
        email: savedObject.email,
        password: ''
      });
    }

    this.form.controls.email.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (val) => {
          localStorage.setItem('saved-form', JSON.stringify({ email: val }));
        }
      });
  }

  onSubmit() {
    const email = this.form.value.email;
    const password = this.form.value.password;

    console.log(email, password);
  }
}