import { Component, inject } from '@angular/core';
import { HttpUsers } from '../../../core/services/http-users';
import { errorContext } from 'rxjs/internal/util/errorContext';
import { BehaviorSubject, Subscriber, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export default class UserList {
subscriberUser! : Subscription // signo de exclamacion aca es para que pase por alto en ese caso Subscriber user sea definido como un valor uindefin 
subcriberDeleteUser! : Subscription

  public userList$ = new BehaviorSubject<any> ([])
  private httpUsers= inject(HttpUsers);
  private router = inject(Router) 
  //saber cunado se inicaliza
  ngOnInit(){
    this.loadUser()
  }

  ngOnDestroy(){
    //verifica si existe una subscription activa para finalizaral 
    if(this.subscriberUser){
      this.subscriberUser.unsubscribe();
    }
    if(this.subcriberDeleteUser){
      this.subcriberDeleteUser.unsubscribe();
    }
  }

 private loadUser(){
    this.subscriberUser = this.httpUsers.getUsers().subscribe({
      next: (data )=>{
        console.log (data)
//asignar la lista de  ussuarios
        this.userList$.next(data.data)
      },
      error: (err)=>{
        console.error(err)
      },
      complete: ()=>{
        console.log('lista de todos los usarios')
      }
    });
  }
  onEdit(id: string){
console.log('Edit', id)
this.router.navigateByUrl(`/dashboard/user/edit/${id}`)
  }

  
   onDelete( id: string ) {

    // Implementa la ventana emergente con SweetAlert2
    Swal.fire({
      title: "¿Estas Seguro?",
      text: "Usuario no se podra recuperar una vez eliminado. ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {

      if (result.isConfirmed) {

        Swal.fire({
          title: "Deleted!",
          text: "Usuario ha sido eliminado.",
          icon: "success"
        });

        // console.log( 'Delete', id );
        // Guarda la subscripcion al Observable para tener control del mismo
        this.subcriberDeleteUser = this.httpUsers.deleteUserById( id ).subscribe({
          next: ( data ) => {
            
            console.log( data );
            this.loadUser();      // Ejecutar
    this.router.navigateByUrl('/dashboard/user/list')


          },
          error: ( err ) => {
            console.error( err );
          },
          complete: () => {
            console.log( 'Peticion al API para eliminar usuario por ID' );
          }
        });
    }

    });
  }

  inUpdate(){}
}
