
import { CommonModule } from '@angular/common';
import { Component, } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { Asistencia } from 'src/app/interfaces/asistencia';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.component.html',
  styleUrls: ['./miclase.component.scss'],
  standalone: true,
  imports: [TranslateModule, CommonModule]
})
export class MiclaseComponent  {

  public usuario: Usuario = new Usuario();

  constructor(private authService: AuthService) { 
    this.authService.usuarioAutenticado.subscribe((usuarioAutenticado) => {
      if (usuarioAutenticado) {
        this.usuario = usuarioAutenticado;
      }
    });
    this.authService.codigoQR.subscribe((codigoQR) => {
      this.usuario.asistencia = JSON.parse(codigoQR);
    });
  }
}
  
