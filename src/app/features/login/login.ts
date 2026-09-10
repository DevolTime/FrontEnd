import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpAuth } from '../../core/services/http-auth';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEgg } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FontAwesomeModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {
  summitted = false
  faegg = faEgg

  formData: FormGroup;
  private httpAuth = inject(HttpAuth);

  constructor() {
    // Define la estructura equivalente del formulario en HTML
    this.formData = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),

    });
  }

  onSubmit() {
    this.summitted = false
    // Verificar si el formulario es valido
    if (this.formData.valid) {
      // Muestro los vaalores
      console.log(this.formData.getRawValue());

      // Usar el servicio para conectar con la API y verificar la autenticacion del usuario
      this.httpAuth.loginUser(this.formData.value).subscribe({
        next: (res) => {
          if (typeof res === 'string') {// { msg: '...', data: { ... }, token: '...' }
            this.summitted = true;
          } else {
            this.summitted = false;
            // Limpiamos los campos del formulario
            this.formData.reset();
          }

        },
        error: (err) => {
          console.error(err);
          this.summitted = true;

        },
        complete: () => {
          console.log('Execute complete');
        }
      });

    }
    else {
      console.log('Formulario invalido');
    }
  }

}
