import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { HttpAuth } from '../../../core/services/http-auth';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe, FontAwesomeModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public httpAuth = inject(HttpAuth)
  private el = inject(ElementRef);
  faCoffee = faCoffee
  faCartShopping = faCartShopping;
  faBars = faBars;
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.menuOpen && !this.el.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }
  logout() {
    this.httpAuth.logoutUser();
  }

  scrollToFooter(): void {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
