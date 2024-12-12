import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { gridOutline, homeOutline, locateOutline, pencilOutline, people, peopleOutline, schoolOutline } from 'ionicons/icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule   
    , FormsModule     
    , IonicModule     
    , TranslateModule
  ]
})
export class FooterComponent {

  @Input() opcionesDisponibles: string[] = [];
  componenteSeleccionada: string = 'codigoqr';

  constructor(private authService: AuthService,private router: Router) { 
    addIcons ({homeOutline, schoolOutline, pencilOutline, gridOutline, locateOutline,peopleOutline});
  }

  cambiarComponente($event: any){
    this.authService.componenteSeleccionada.next(this.componenteSeleccionada);

  }
  logout() {
    this.authService.logout();
  }
  redirigir(){
    this.router.navigate(['/miruta']);
  }
}
