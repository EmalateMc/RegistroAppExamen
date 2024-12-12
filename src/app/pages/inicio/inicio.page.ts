import { ScannerService } from './../../services/scanner.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { MiclaseComponent } from 'src/app/components/miclase/miclase.component';
import { CodigoqrComponent } from 'src/app/components/codigoqr/codigoqr.component';
import { MisdatosComponent } from 'src/app/components/misdatos/misdatos.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { ForumComponent } from 'src/app/components/forum/forum.component';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { Capacitor } from '@capacitor/core';
import { Location } from '@angular/common';
import { UsuariosComponent } from 'src/app/components/usuarios/usuarios.component';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [HeaderComponent, MiclaseComponent, CodigoqrComponent, ForumComponent, LanguageComponent, MisdatosComponent, FooterComponent, IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, CommonModule, FormsModule, UsuariosComponent]

})

export class InicioPage {
  
  @ViewChild(FooterComponent) footer!: FooterComponent;

  componenteSeleccionada: string = 'codigoqr';
  isAdmin: boolean = false; // Variable para verificar si el usuario es admin
  opcionesDisponibles: string[] = ['codigoqr', 'miclase', 'foro', 'misdatos']; // Opciones para todos los usuarios

  constructor(private authService: AuthService, private scanner: ScannerService, private location: Location) {
    this.authService.usuarioAutenticado.subscribe(usuario => {
      if (usuario) {
        // Verificar si es admin
        this.isAdmin = usuario.cuenta === 'admin';
        this.configurarOpciones();
      }
    });

    this.authService.componenteSeleccionada.subscribe(async (componenteSeleccionada) => {
      if (componenteSeleccionada === 'codigoqr' && Capacitor.platform === 'web') {
        this.componenteSeleccionada = 'codigoqr';
      }

      if (componenteSeleccionada === 'codigoqr' && Capacitor.platform !== 'web') {
        const codigoQR = await this.scanner.scan();
        this.authService.codigoQR.next(codigoQR);
        this.componenteSeleccionada = 'miclase';
        return;
      }

      this.componenteSeleccionada = componenteSeleccionada;
    });
  }

  ngOnInit() {
    // Inicializar la vista cuando el componente esté listo
    this.componenteSeleccionada = 'codigoqr';
  }

  ionViewWillEnter() {
    // Ejecutar lógica cuando la vista se va a cargar
    this.componenteSeleccionada = 'codigoqr';
  }

  // Configurar las opciones disponibles según el tipo de usuario
  configurarOpciones() {
    if (this.isAdmin) {
      // Si es admin, solo mostrar las opciones 'foro', 'misdatos' y 'usuarios'
      this.opcionesDisponibles = ['foro', 'misdatos', 'usuarios']; // Añadimos "usuarios" para admin
    } else {
      // Si es un usuario normal, mostrar todas las opciones
      this.opcionesDisponibles = ['codigoqr', 'miclase', 'foro', 'misdatos'];
    }
  }

  qrFueEscaneado($event: any) {
    this.componenteSeleccionada = 'miclase';
    this.footer.componenteSeleccionada = 'miclase';
  }

  qrFueDetenido() {
    // Aquí puedes manejar los casos donde el escaneo sea detenido si es necesario
  }

}
