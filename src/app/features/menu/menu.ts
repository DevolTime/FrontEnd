import { Component } from '@angular/core';
import { CartFloating } from '../../shared/components/cart-floating/cart-floating';

@Component({
  selector: 'app-menu',
  imports: [CartFloating],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {}
