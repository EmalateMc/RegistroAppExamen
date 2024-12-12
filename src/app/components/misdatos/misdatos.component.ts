import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { Usuario } from 'src/app/model/usuario';
import { ChangeDetectorRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { databaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { APIClientService } from 'src/app/services/apiclient.service';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { showAlert, showToast } from 'src/app/tools/message-functions';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatNativeDateModule } from '@angular/material/core'; 
import { MatDatepickerToggle } from '@angular/material/datepicker'; 
import { convertDateToString } from 'src/app/tools/date-functions';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  standalone: true,
  imports: [ 
    IonHeader, IonicModule , IonTitle, IonToolbar, CommonModule, FormsModule, MatDatepickerModule,
    MatInputModule, MatFormFieldModule, MatDatepickerToggle,
    MatNativeDateModule,
    TranslateModule  ]

})
export class MisdatosComponent  {
  misDatos: any = {fechaNacimiento: null};
  usuario: Usuario = new Usuario();
  usuarios: Usuario[] = [];
  listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();

  constructor(
    private bd: databaseService,
    private auth: AuthService,
    private api: APIClientService,
    private cdr: ChangeDetectorRef
    )
  {
;

  this.auth.leerUsuarioAutenticado().then((usuario) => {
    if (usuario) {
      this.usuario = usuario;
      console.log(this.usuario);
      }
    });
  }

  ngOnInit() {

    console.log("Nivel Educacional del Usuario:", this.usuario.NivelEducacional.id);
    this.cdr.detectChanges();
    const datosDeUsuario = { fechaNacimiento: '1990-05-10' }; // Simulando los datos de la BD
    this.usuario.FechaNacimiento = new Date(datosDeUsuario.fechaNacimiento);

    console.log(this.usuario.FechaNacimiento);

  }


  guardarUsuario() {
    if (this.usuario.Nombre.trim() === '') {
      showToast('El usuario debe tener un nombre');
    } else {
      console.log(this.usuario);
      this.bd.guardarUsuario(this.usuario);
      this.auth.guardarUsuarioAutenticado(this.usuario);
      showAlert('El usuario fue guardado correctamente');
    }
  }


  niveles: NivelEducacional[] = NivelEducacional.getNivelesEducacionales();

  actualizarNivelEducacional(event: any) {
    const idSeleccionado = event.detail.value;
    const nivelSeleccionado = this.niveles.find(nivel => nivel.id === idSeleccionado);

    if (nivelSeleccionado) {
      console.log('Nivel seleccionado:', nivelSeleccionado);
      this.usuario.NivelEducacional = nivelSeleccionado;  // Ahora estamos asignando una instancia de NivelEducacional
    } else {
      console.error('Nivel educacional no encontrado.');
      this.usuario.NivelEducacional = this.niveles[0];  // Asignar un nivel por defecto si no se encuentra
    }
  }
  onFechaNacimientoChange(event: any) {
    this.usuario.FechaNacimiento = new Date(event.detail.value); // Convertir de ISO a Date
  }
}