import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { HttpAuth } from '../../../core/services/http-auth';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public httpAuth =inject(HttpAuth)
  faCoffee = faCoffee
  faCartShopping = faCartShopping;
  faBars = faBars;
  logout(){
    this.httpAuth.logoutUser();
  }
}
