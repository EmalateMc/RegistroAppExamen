import { Component, OnInit } from '@angular/core';
import { AnimationController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { IonHeader, IonToolbar, IonTitle,IonCardHeader,IonCardSubtitle,IonContent,IonCard, IonCardTitle, IonLabel, IonItem, IonButton, IonCardContent, IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { databaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardTitle, IonLabel, IonItem, IonButton,
    IonCardContent, IonInput, FormsModule, IonCardHeader, IonCardSubtitle, TranslateModule
  ]
})
export class PreguntaPage implements OnInit {

  Nombre: string = '';
  Apellido: string = '';
  pregunta: string = '';
  respuesta: string = '';
  correo: string = '';

  constructor(private router: Router, private authService: AuthService, private toastController: ToastController) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.pregunta = navigation.extras.state['pregunta'] || '';
      this.correo = navigation.extras.state['correo'] || '';  // Recuperamos también el correo
    } else {
      this.navigateBack();
    }
  }

  ngOnInit(): void {

  }

  

  async verificarRespuesta() {
    if (!this.respuesta) {
      this.mostrarMensaje('Por favor ingresa una respuesta.');
      return;
    }

    try {
      // Verificar que el correo no esté vacío
      if (!this.correo) {
        this.mostrarMensaje('El correo no está disponible.');
        return;
      }

      // Buscar al usuario por correo
      const usuario = await this.authService.buscarUsuarioPorCorreo(this.correo);

      if (!usuario) {
        console.log('Usuario no encontrado:', this.correo);
        this.router.navigate(['/incorrecto']); // Redirigir si no se encuentra el usuario
        return;
      }

      console.log('Usuario encontrado:', usuario);
      // Limpiar y normalizar las respuestas para una comparación justa
      const respuestaSecreta = usuario.respuestaSecreta.trim().toLowerCase();
      const respuestaIngresada = this.respuesta.trim().toLowerCase();

      console.log('Respuesta Secreta:', respuestaSecreta);
      console.log('Respuesta Ingresada:', respuestaIngresada);

      // Comparar la respuesta secreta con la ingresada
      if (respuestaSecreta === respuestaIngresada) {
        // Si la respuesta es correcta, redirigir a la página correcta con la contraseña
        console.log('Respuesta correcta');
        this.router.navigate(['/correcto'], { state: { password: usuario.password } });
      } else {
        // Si la respuesta es incorrecta, redirigir a la página incorrecta
        console.log('Respuesta incorrecta');
        this.router.navigate(['/incorrecto']);
      }
    } catch (error) {
      console.error('Error al verificar la respuesta:', error);
      this.mostrarMensaje('Ocurrió un error al verificar la respuesta.');
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

  navigateBack() {
    this.router.navigate(['/correo']);
  }
}