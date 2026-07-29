import { Component } from '@angular/core';
import { CartFloating } from '../../shared/components/cart-floating/cart-floating';

@Component({
  selector: 'app-home',
  imports: [CartFloating],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
