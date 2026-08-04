import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map } from 'rxjs';
<<<<<<< HEAD
import { ResponseUsers } from '../../core/Models/users';
=======
import { ResponseUsers } from '../models/users';
>>>>>>> 5a89f2ca501f8638ba5418b2f43f41372bdb5dd4
import { environment } from '../../../environments/environment';

@Service()
export class HttpUsers {
    private http = inject (HttpClient);

//metodo para realizar una peticion a mi api dond eobtengo toda la lista de usuarios 
BASE_URL: string = environment.apiUrl
createUser(newUser:any){
    return this.http.post<any>(`${this.BASE_URL}/users`,newUser)
}

getUsers(){
 return this.http.get<any>(`${this.BASE_URL}/users`)
 
}
getUserById(id: string | any){
    return this.http.get<any>(`${this.BASE_URL}/users/${id}`)
}

deleteUserById(id: string){
    return this.http.delete(`${this.BASE_URL}/users/${id}`)
}

updateUserById(id:string| null, updateUser:any){
    return this.http.patch(`${this.BASE_URL}/users/${id}`, updateUser )
}
}