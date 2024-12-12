import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { databaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class InitializeService {
  isAppInit: boolean = false;
  platform: string = '';

  constructor(
    private sqliteService: SQLiteService,
    private storageService: databaseService,
    private authService: AuthService) { }

  async inicializarAplicacion() {
    await this.sqliteService.inicializarPlugin().then(async (ret) => {
      this.platform = this.sqliteService.platform;
      try {
        if (this.sqliteService.platform === 'web') {
          await this.sqliteService.inicializarAlmacenamientoWeb();
        }
        await this.storageService.inicializarBaseDeDatos();
        this.authService.inicializarAutenticacion();
        this.isAppInit = true;
      } catch (error) {
        console.log(`inicializarAplicacionError: ${error}`);
      }
    });
  }
  
}
