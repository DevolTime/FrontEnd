import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map } from 'rxjs';
import { ResponseUsers } from '../models/users';

@Service()
export class HttpUsers {
    private http = inject (HttpClient);

//metodo para realizar una peticion a mi api dond eobtengo toda la lista de usuarios 
getUsers(){
 return this.http.get<ResponseUsers>('http://localhost:3000/api/users').pipe(
    map((res) => {
        console.log(res.data)
       return res.data}))
}

}

