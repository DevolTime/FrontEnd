import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { HttpRoles } from '../../../core/services/http-roles';
import { HttpStatus } from '../../../core/services/http-status';
import { HttpUsers } from '../../../core/services/http-users';

@Component({
  selector: 'app-user-new-form',
  imports: [RouterLink, ReactiveFormsModule, AsyncPipe],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export class UserNewForm {

  private httpRoles = inject(HttpRoles);
  private httpStatus = inject(HttpStatus);
  private httpUsers = inject(HttpUsers);
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
      status: new FormControl('', [Validators.required]),
      avatar: new FormControl(''),
      role: new FormControl('', [Validators.required]),
    });

  }

  ngOnInit() {

    this.httpRoles.getRoles().subscribe({
      next: (roles) => {
        this.roleList$.next(roles.data);
      }
    });

    this.httpStatus.getStatus().subscribe({
      next: (status) => {
        this.statusList$.next(status.data);
      }
    });

  }

  onSubmit() {

    if (this.password?.value !== this.confirmPassword?.value) {
      return;
    }

    if (this.formData.invalid) {
      return;
    }

    this.httpUsers.createUser(this.formData.value).subscribe({

      next: (res) => {

        console.log(res);

        this.formData.reset();

        this.router.navigateByUrl('/dashboard/user/list');

      },

      error: (err) => {

        if (err.status === 409) {
          this.formData.get('email')?.setErrors({emailExists:true});
        }
        console.error(err);

      }
      

    });

  }

  get password() {
    return this.formData.get('password');
  }

  get confirmPassword() {
    return this.formData.get('confirmPassword');
  }

}