import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { LOGIN_INFO } from './login-info.model';
import { randomUUID } from 'crypto';
import { RouterLink } from '@angular/router';

function isMatched(control: AbstractControl) {
  if (control.value.password === control.value.confirmPassword) {
    return null;
  } else {
    return {
      notMatched: true,
    };
  }
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}
  savedLogins: LOGIN_INFO[] = [];

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          nonNullable: true,
          validators: [Validators.minLength(6), Validators.required],
        }),
        confirmPassword: new FormControl('', {
          nonNullable: true,
          validators: [Validators.minLength(6), Validators.required],
        }),
      },
      {
        validators: [isMatched],
      },
    ),
  });

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadSavedForm();
    this.loadSavedLogins();

    this.form.valueChanges.subscribe((val) => {
      this.saveDraftEmail(val.email ?? '');
    });
  }

  get passwordInvalid() {
    return (
      this.form.controls.passwords.controls.password.touched &&
      this.form.controls.passwords.controls.password.dirty &&
      this.form.controls.passwords.controls.password.invalid
    );
  }

  get passwordRequired() {
    const password = this.form.controls.passwords.controls.password;
    return password.hasError('required') && (password.touched || password.dirty);
  }

  get passwordTooShort() {
    const password = this.form.controls.passwords.controls.password;
    return password.hasError('minlength') && (password.touched || password.dirty);
  }

  get confirmPasswordRequired() {
    const confirmPassword = this.form.controls.passwords.controls.confirmPassword;
    return (
      confirmPassword.hasError('required') && (confirmPassword.touched || confirmPassword.dirty)
    );
  }

  get confirmPasswordTooShort() {
    const confirmPassword = this.form.controls.passwords.controls.confirmPassword;
    return (
      confirmPassword.hasError('minlength') && (confirmPassword.touched || confirmPassword.dirty)
    );
  }

  get passwordsNotMatched() {
    return (
      this.form.controls.passwords.hasError('notMatched') &&
      this.form.controls.passwords.controls.confirmPassword.dirty
    );
  }

  get emailInvalid() {
    return (
      this.form.controls.email.invalid &&
      this.form.controls.email.touched &&
      this.form.controls.email.dirty
    );
  }

  get emailRequired() {
    return (
      this.form.controls.email.hasError('required') &&
      (this.form.controls.email.touched || this.form.controls.email.dirty)
    );
  }

  get emailFormatInvalid() {
    return (
      this.form.controls.email.hasError('email') &&
      (this.form.controls.email.touched || this.form.controls.email.dirty)
    );
  }

  notUniqueEmail() {
    return this.savedLogins.some((el) => this.form.value.email === el.email);
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.notUniqueEmail()) {
      console.log('invalid');
      return;
    } else {
      const formValue = this.form.getRawValue();
      this.savedLogins.push({
        id: String(Math.random() * 1000),
        email: formValue.email,
        password: formValue.passwords.password,
      });
      this.saveLogins();
      this.form.reset();
    }

    console.log(this.savedLogins);
  }

  private loadSavedForm() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedForm = window.localStorage.getItem('savedForm');
    if (savedForm) {
      const savedObject = JSON.parse(savedForm);
      this.form.patchValue({
        email: savedObject.email ?? '',
      });
    }
  }

  private loadSavedLogins() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedLoginsFetch = window.localStorage.getItem('saved-logins');
    if (savedLoginsFetch) {
      this.savedLogins = JSON.parse(savedLoginsFetch);
    } else {
      this.savedLogins = [];
    }
  }

  private saveDraftEmail(email: string) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.localStorage.setItem('savedForm', JSON.stringify({ email }));
  }

  private saveLogins() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.localStorage.setItem('saved-logins', JSON.stringify(this.savedLogins));
  }
}
