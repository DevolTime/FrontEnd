import { Component, inject } from '@angular/core';
import { HttpUsers } from '../../../core/services/http-users/http-users';
import { error } from 'console';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-users-list',
  imports: [JsonPipe],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export default class UsersList {
  users: any = {};

  // inyectar una dependencia
  private httpUsers = inject(HttpUsers);

  // Hook del ciclo de vida de un componente en Angular (cuando se inicializa el componente)
  ngOInit() {
    // Invocando la funcionalidad del servicio - Obtiene todos los usuarios
    this.httpUsers.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}
