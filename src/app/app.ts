import { Component, signal, inject } from '@angular/core';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { RouterOutlet, Router } from '@angular/router'; // Importamos Router

@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  router = inject(Router); //  Inyectamos el Router
}