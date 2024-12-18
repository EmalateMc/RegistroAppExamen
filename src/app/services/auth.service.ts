import { Asistencia } from './../interfaces/asistencia';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { showToast } from '../tools/message-functions';
import { Usuario } from '../model/usuario';
import { Storage } from '@ionic/storage-angular';
import { databaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  keyUsuario = 'USUARIO_AUTENTICADO';
  usuarioAutenticado = new BehaviorSubject<Usuario | null>(null);
  primerInicioSesion =  new BehaviorSubject<boolean>(false);
  componenteSeleccionada = new BehaviorSubject<string>('codigoqr'); 
  codigoQR = new BehaviorSubject<string>(''); 


  constructor(private router: Router, private bd: databaseService, private storage: Storage) { }

  async inicializarAutenticacion() {
    await this.storage.create();
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.leerUsuarioAutenticado().then(usuario => {
      return usuario !== null;
    });
  }

  async leerUsuarioAutenticado(): Promise<Usuario | null> {
    const usuario = await this.storage.get(this.keyUsuario) as Usuario;
    this.usuarioAutenticado.next(usuario);
    return usuario;
  }

  guardarUsuarioAutenticado(usuario: Usuario) {
    this.storage.set(this.keyUsuario, usuario);
    this.usuarioAutenticado.next(usuario);
  }

  eliminarUsuarioAutenticado(usuario: Usuario) {
    this.storage.remove(this.keyUsuario);
    this.usuarioAutenticado.next(null);
  }

  async login(cuenta: string, password: string) {
    await this.storage.get(this.keyUsuario).then(async (usuarioAutenticado) => {
      if (usuarioAutenticado) {
        this.usuarioAutenticado.next(usuarioAutenticado);
        this.primerInicioSesion.next(false); // Avisar que no es el primer inicio de sesión
        this.router.navigate(['/inicio']);
      } else {
        await this.bd.buscarUsuarioValido(cuenta, password).then(async (usuario: Usuario | undefined) => {
          if (usuario) {
            showToast(`¡Bienvenido(a) ${usuario.Nombre} ${usuario.Apellido}!`);
            this.guardarUsuarioAutenticado(usuario);
            this.primerInicioSesion.next(true); // Avisar que es el primer inicio de sesión
            this.router.navigate(['/inicio']);
          } else {
            showToast(`El correo o la password son incorrectos`);
            this.router.navigate(['/ingreso']);
          }
        });
      }
    });
  }

  async logout() {
    this.leerUsuarioAutenticado().then((usuario) => {
      if (usuario) {
        showToast(`¡Hasta pronto ${usuario.Nombre} ${usuario.Apellido}!`);
        this.eliminarUsuarioAutenticado(usuario);
      }
      this.router.navigate(['/ingreso']);
    })
  }
  async obtenerPreguntaSecreta(correo: string): Promise<string | null> {
    const usuario = await this.bd.buscarUsuarioPorCorreo(correo);
    return usuario ? usuario.preguntaSecreta : null;
  }

  async buscarUsuarioPorCorreo(correo: string): Promise<Usuario | undefined> {
    return await this.bd.buscarUsuarioPorCorreo(correo);
  }

  async obtenerRespuestaSecreta(correo: string): Promise<string | null> {
    const usuario = await this.bd.buscarUsuarioPorCorreo(correo);
    return usuario ? usuario.respuestaSecreta : null;
  }
  

}
