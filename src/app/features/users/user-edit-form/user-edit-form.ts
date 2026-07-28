import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpStatus } from '../../../core/services/http-status';
import { HttpRoles } from '../../../core/services/http-roles';
import { AsyncPipe } from '@angular/common';
import { HttpUsers } from '../../../core/services/http-users';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-edit-form',
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './user-edit-form.html',
  styleUrl: './user-edit-form.css',
})
export default class UserEditForm {
  selectedId: String | null | any

  private router = inject(Router)
  private httpRoles = inject(HttpRoles);
  private httpStatus = inject(HttpStatus)
  private httpUsers =inject(HttpUsers)

  private activatedRoute = inject(ActivatedRoute)
  roleList$ = new BehaviorSubject<any[]>([]);
  statusList$ = new BehaviorSubject<any[]>([])


  public formData: FormGroup;




  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      status: new FormControl('', [Validators.required]),
      avatar: new FormControl(),
      role: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    //obtenrerl id que se encuentra en la URl (solaemtne cundao el formulario de editar es un componenete de pagina )
    this.selectedId = this.activatedRoute.snapshot.paramMap.get(`id`)

    this.getRoles()
    this.getDataFillForm()

  }

private getDataFillForm(){
  this.httpUsers.getUserById(this.selectedId).subscribe({
   next: (data) => {
      console.log(data)

      //desustructurar 
    const {name, lastname,email,status,role,avatar} =data.data

      //se va a inyectar llos datos de la bd al formulario por el id 
      this.formData.patchValue({
        name,
        lastname,
        email,
        status,
        avatar,
        role
      })
    },
    error: (err) => {
      console.error(err)
    },
    complete: () => {
      console.log('Realiza peticion para atualizar el usuario por ID')
    }
})} 


private getRoles(){
  this.httpRoles.getRoles().subscribe({
    next: (roles) => {
      console.log(roles),
        this.roleList$.next(roles.data);
    },
    error: (err) => {
      console.error(err)
    },
    complete: () => {
      console.log('complete siempre se ejecuta ')
    }
  })
  this.httpStatus.getStatus().subscribe({
    next: (status) => {
      console.log(status),
        this.statusList$.next(status.data)
    },
    error: (err) => {
      console.error(err)
    },
    complete: () => {
      console.log('siempre se ejecuta')
    }

  })


}
onSubmit(){
//validar que el fromilario sea valido n
Swal.fire({
      title: "¿Estas Seguro?",
      text: "El Usuario se editara. ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Editar!"
    }).then((result) => {

      if (result.isConfirmed) {

        Swal.fire({
          title: "¡Editado!",
          text: "Usuario ha sido actualizado.",
          icon: "success"
        });


  if (this.formData.valid){
console.log(this.formData.value)

this.httpUsers.updateUserById(this.selectedId, this.formData.value).subscribe({
  next:(data)=>{
    console.log(data)
    this.router.navigateByUrl('/user/list')
  }
    ,
  error:(err)=>{
    console.error(err)},
  complete:()=>{
    console.log('actulizar usuarios') }
  }
)}

//ejecutirar el servicio que permite actualizar los datos del formulario
else{
  console.log('formulario invalido')
 }
 }

    });


}
get password (){
  return this.formData.get('password')
}
get confirmPassword (){
  return this.formData.get('password')
}
}