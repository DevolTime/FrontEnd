import { Component, inject} from '@angular/core';
import { FormControl, FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { HttpPedidos } from '../../../core/services/http-pedidos';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'app-pedidos-newform',
  imports: [ReactiveFormsModule],
  templateUrl: './pedidos-newform.html',
  styleUrl: './pedidos-newform.css',
})
export  default class PedidosNewform {
  private HttpPedidos = inject (HttpPedidos);
  formData: FormGroup;

  constructor (){
    this.formData = new FormGroup({
  direccion_entrega: new FormControl('', [Validators.required]),
  precio_total: new FormControl('', [Validators.required]),
  Productos: new FormControl('', [Validators.required]),
  description: new FormControl('', [Validators.required]),
  status: new FormControl('', [Validators.required]),
});
  }
 onSubmit () {
  console.log("Botón presionado");
  console.log(this.formData.value);
  console.log("Formulario válido:", this.formData.valid);

  if (this.formData.valid) {

    this.HttpPedidos.newPedidos(this.formData.value).subscribe({
      next: (data: any) => {
        console.log("Pedido creado", data);
      }, 
      error: (error: any) => {
        console.error("Error al guardar el pedido", error);
      }
    });
 } else {
    console.log("El formulario no es válido");
  }
  }
};
