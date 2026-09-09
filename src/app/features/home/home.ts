import { Component } from '@angular/core';
import { CartFloating } from '../../shared/components/cart-floating/cart-floating';
import { Banner } from '../../shared/components/banner/banner';

@Component({
  selector: 'app-home',
  imports: [CartFloating, Banner],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
