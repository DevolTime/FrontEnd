import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';


import { HttpUsers } from '../../../core/services/http-users';
import { sign } from 'crypto';

@Component({
  selector: 'app-user-list',
  imports: [JsonPipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export default class UserList {
  users!: any 
private httpUsers = inject (HttpUsers)

// hook de ciclo de vida de angular
ngOnInit(){
  //invocando la funcionalidad del servicion ontiene todos los uasuaerios
  this.httpUsers.getUsers().subscribe({
    next: (users) =>{
      console.log(users);
      this.users = users;
    },
    error: (err) =>{
      console.error(err)
    },
  })
}

}
