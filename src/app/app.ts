import { Component, signal, inject } from '@angular/core';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { RouterOutlet, Router } from '@angular/router'; // Importamos Router
import { CategoryNewForm } from './features/category/category-new-form/category-new-form';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Fronted');
  protected router = inject(Router); //  Inyectamos el Router
}