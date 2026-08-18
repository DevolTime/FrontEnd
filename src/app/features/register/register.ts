import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';


import { HttpRoles } from '../../../app/core/services/http-roles';
import { HttpStatus } from '../../../app/core/services/http-status';
import { HttpUsers } from '../../../app/core/services/http-users';
import { HttpAuth } from '../../core/services/http-auth';

@Component({
  selector: 'app-user-new-form',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export default class UserNewForm {

  private httpUsers = inject(HttpUsers);
  private httpAuth= inject(HttpAuth)
  private router = inject(Router);

  roleList$ = new BehaviorSubject<any[]>([]);
  statusList$ = new BehaviorSubject<any[]>([]);

  public formData: FormGroup;

  constructor() {

    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

  }

  ngOnInit() {
   

  }

  onSubmit() {
    Swal.fire({
      title: "¿Estas Seguro?",
      text: "Se realizara el registro. ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Registrar!"
    }).then((result) => {

      if (result.isConfirmed) {

        Swal.fire({
          title: "Registrado!",
          text: "Usuario he ha registrado.",
          icon: "success"
        });

            this.httpUsers.createUser(this.formData.value).subscribe({

      next: (res) => {

console.log('Entró al register');
        console.log(res);
  
        this.router.navigateByUrl('/dashboard');

      },

      error: (err) => {

        if (err.status === 409) {
          this.formData.get('email')?.setErrors({emailExists:true});
        }
        console.error(err);

      }
      

  });

      }

    if (this.formData.invalid) {
      return;
    }


    })
  }

  get password() {
    return this.formData.get('password');
  }

  get confirmPassword() {
    return this.formData.get('confirmPassword');
  }

}