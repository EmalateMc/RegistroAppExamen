import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AnimationController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { databaseService } from 'src/app/services/database.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardTitle, IonLabel, IonCardContent, IonItem, IonInput, IonButton} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonCard, IonCardTitle, IonLabel, IonCardContent,
    IonItem, IonInput, IonButton, FormsModule, TranslateModule
  ]

})
export class CorreoPage implements OnInit {
  correo: string = '';

  constructor(private authService: AuthService, private router: Router, private toastController: ToastController ) {}

  ngOnInit(): void {

  }

  async ingresarCorreo() {
    if (!this.correo) {
      this.mostrarMensaje('Por favor ingresa un correo.');
      return;
    }
  
    try {
      const preguntaSecreta = await this.authService.obtenerPreguntaSecreta(this.correo);
      if (preguntaSecreta) {
        // Navegar a la página de pregunta secreta y pasar tanto la pregunta como el correo
        this.router.navigate(['/pregunta'], { 
          state: { 
            pregunta: preguntaSecreta, 
            correo: this.correo  // Aquí estamos pasando el correo también
          }
        });
      } else {
        // Si el correo no es encontrado, redirigir a la página "incorrecto"
        this.router.navigate(['/incorrecto']);
      }
    } catch (error) {
      console.error('Error al buscar el usuario:', error);
      this.mostrarMensaje('Ocurrió un error al buscar el usuario.');
    }
  }
  

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  regresar() {
    this.router.navigate(['/ingreso']);
  }
}

