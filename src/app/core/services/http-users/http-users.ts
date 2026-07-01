import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { ResponseUsers } from '../../Models/Users';

@Component({
  selector: 'app-http-users',
  imports: [],
  templateUrl: './http-users.html',
  styleUrl: './http-users.css',
})
export class HttpUsers {
  private http = inject(HttpClient);

  // Metodo para consultar la lista de usuarios

  getUsers() {
    return this.http.get<ResponseUsers>('http://localhost:3000/api/users').pipe(
      map((data) => data.data)
    )
  }
}
