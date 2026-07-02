import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export class UserNewForm {
 public formData:FormGroup; 
 constructor (){
  this.formData = new FormGroup({
    name: new FormControl(),
    lastname: new FormControl(),
    password:new FormControl(),
    email:new FormControl(),
    status:new FormControl(),
    avatar:new FormControl(),
    role:new FormControl(),
  })
 }
 onSummit(){
  console.log(this.formData.value);
 } 

}
