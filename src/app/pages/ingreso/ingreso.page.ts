import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { Router } from '@angular/router';
import { colorWandOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
  standalone: true,
  imports: [
      CommonModule            // CGV-Permite usar directivas comunes de Angular
    , FormsModule             // CGV-Permite usar formularios
    , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule         // CGV-Permite usar pipe 'translate'
    , LanguageComponent // CGV-Lista de idiomas
  ]
})
export class IngresoPage implements ViewWillEnter {

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  cuenta: string;
  password: string;

  constructor(
      private router: Router
    , private translate: TranslateService
    , private authService: AuthService) 
  { 
    this.cuenta = 'atorres';
    this.password = '1234';
    addIcons({ colorWandOutline }); 
  }

  async ionViewWillEnter() {
    new this.selectLanguage.changeCurrentLanguage();
  }

  navigateTheme() {
    this.router.navigate(['/theme']);
  }

  ingresar() {
    this.authService.login(this.cuenta, this.password);
    this.router.navigate(['/inicio']);
  }

  ruta() {
    this.router.navigate(['/miruta']);

  }

  olvidar() {
    this.router.navigate(['/correo']);

  }

  registro() {
    this.router.navigate(['/registrarse'])
  }

}