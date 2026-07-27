import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

import { faTiktok, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  faCoffee = faCoffee;

  faTiktok = faTiktok;
  faInstagram = faInstagram;
  faYoutube = faYoutube;
}