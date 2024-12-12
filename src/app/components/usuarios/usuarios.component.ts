import { Component, OnInit } from '@angular/core';
import { databaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/model/usuario';
import { showToast } from 'src/app/tools/message-functions';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule,FooterComponent]
})
export class UsuariosComponent  implements OnInit {
  usuarios: Usuario[] = [];
  esAdmin: boolean = false;

  constructor(private dbService: databaseService, private authService: AuthService) {}

  async ngOnInit() {
    // Cargar los usuarios
    this.dbService.listaUsuarios.subscribe((usuarios) => {
      this.usuarios = usuarios;
    });

    // Verificar si el usuario autenticado es "admin"
    const usuarioAutenticado = await this.authService.leerUsuarioAutenticado();
    this.esAdmin = usuarioAutenticado?.cuenta === 'admin';
  }

  // Método para eliminar usuario
  async eliminarUsuario(cuenta: string) {
    if (cuenta !== 'admin') {
      await this.dbService.eliminarUsuarioUsandoCuenta(cuenta);
      showToast(`Usuario ${cuenta} eliminado correctamente.`);
    } else {
      showToast('No puedes eliminar la cuenta "admin".');
    }
  }
}
