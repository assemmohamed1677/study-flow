import { isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { LOGIN_INFO } from '../signup/login-info.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private router = inject(Router);
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}
  savedLogins: LOGIN_INFO[] = [];
  loginInformationInvalid = false;

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  get emailInvalid() {
    return (
      this.form.controls.email.invalid &&
      this.form.controls.email.dirty &&
      this.form.controls.email.touched
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

  get passwordInvalid() {
    return (
      this.form.controls.password.invalid &&
      this.form.controls.password.dirty &&
      this.form.controls.password.touched
    );
  }

  get passwordRequired() {
    return (
      this.form.controls.password.hasError('required') &&
      (this.form.controls.password.touched || this.form.controls.password.dirty)
    );
  }

  get passwordTooShort() {
    return (
      this.form.controls.password.hasError('minlength') &&
      (this.form.controls.password.touched || this.form.controls.password.dirty)
    );
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadSavedLogins();

    const savedForm = localStorage.getItem('saved-form');

    if (savedForm) {
      const savedObject = JSON.parse(savedForm);

      this.form.patchValue({
        email: savedObject.email,
        password: '',
      });
    }

    this.form.controls.email.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (val) => {
        localStorage.setItem('saved-form', JSON.stringify({ email: val }));
      },
    });

    this.form.valueChanges.subscribe(() => {
      this.loginInformationInvalid = false;
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.loginInformationInvalid = false;
      return;
    }

    if (!this.checkCredintals()) {
      this.loginInformationInvalid = true;
    } else {
      this.loginInformationInvalid = false;
      this.router.navigate(['/dashboard']);
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

  checkCredintals() {
    const loggedElement = this.savedLogins.find((el) => el.email === this.form.value.email);
    if (loggedElement && loggedElement.password === this.form.value.password) {
      return true;
    } else {
      return false;
    }
  }
}
