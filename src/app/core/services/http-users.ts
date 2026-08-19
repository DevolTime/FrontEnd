import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpAuth } from './http-auth';

@Service()
export class HttpUsers {
    private http = inject (HttpClient);
    private httpAuth = inject(HttpAuth)



//metodo para realizar una peticion a mi api dond eobtengo toda la lista de usuarios 
BASE_URL: string = environment.apiUrl


constructor(){
    console.log(this.httpAuth.token)
}
getHeader():HttpHeaders{

    const token = this.httpAuth.token
    return new HttpHeaders({
        'X-Token' : token||'',
        'Content-type':'application/json'

    })
}

createUser(newUser:any){
    return this.http.post<any>(`${this.BASE_URL}/users`,newUser,{headers:this.getHeader()})
}

getUsers(){
 return this.http.get<any>(`${this.BASE_URL}/users`, {headers:this.getHeader()})
 
}
getUserById(id: string | any){
    return this.http.get<any>(`${this.BASE_URL}/users/${id}`,{headers:this.getHeader()})
}

deleteUserById(id: string){
    return this.http.delete(`${this.BASE_URL}/users/${id}`,{headers:this.getHeader()})
}

updateUserById(id:string| null, updateUser:any){
    return this.http.patch(`${this.BASE_URL}/users/${id}`, updateUser, {headers:this.getHeader()} )
}
}