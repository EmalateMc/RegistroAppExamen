import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core'; // <-- Import this


@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule  ]

})
export class CorrectoPage {

  password: string = '';

  constructor(private router: Router) {
    // Recuperar el estado de la navegación, que debe contener la contraseña
    const navigation = this.router.getCurrentNavigation();
    
    if (navigation && navigation.extras && navigation.extras.state) {
      // Si hay estado, asignamos la contraseña
      this.password = navigation.extras.state['password'] || '';
    } else {
      // Si no se pasa estado, redirigir al usuario a la página de correo
      this.router.navigate(['/correo']);
    }
  }

  // Función para navegar de vuelta a la página de inicio
  navigateBack() {
    this.router.navigate(['/ingreso']);
  }
}


