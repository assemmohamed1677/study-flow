import { Component, Inject , OnInit, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

function isMatched (control :AbstractControl){
  if (control.value.password === control.value.confirmPassword)
  {
    return null
  }
  else {
    return {
      notMatched : true
    }
  }
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

form = new FormGroup({
  email : new FormControl('',{
    validators : [Validators.email ,Validators.required]
  }),
  passwords : new FormGroup({
 password : new FormControl( '',{
  validators : [Validators.minLength(6) , Validators.required]
  
 }),
  confirmPassword : new FormControl('',
    {
      validators : [Validators.minLength(6), Validators.required]
    }
  )
  },{
    validators :[  isMatched]
  })
 
})

ngOnInit(): void {
  if (!isPlatformBrowser(this.platformId)) {
      return;
    }

   const savedForm =  (window.localStorage.getItem('savedForm'))

   if (savedForm){
    const savedObject =JSON.parse(savedForm)
    this.form.patchValue({
      email: savedObject.email ?? '',
    })
   }



 this.form.valueChanges.subscribe((val)=>{window.localStorage.setItem ('savedForm', JSON.stringify({email : val.email })
)})}

get passwordInvalid(){
  return   this.form.controls.passwords.controls.password.touched && this.form.controls.passwords.controls.password.dirty 
  && this.form.controls.passwords.controls.password.invalid
}

get passwordsNotMatched(){
  return  this.form.controls.passwords.invalid &&this.form.controls.passwords.dirty
}

get emailInvalid(){
  return this.form.controls.email.invalid && this.form.controls.email.touched && this.form.controls.email.dirty
}

onSubmit(){
 console.log( this.form)
}



}
