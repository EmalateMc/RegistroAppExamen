import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { Usuario } from '../model/usuario';
import { BehaviorSubject } from 'rxjs';
import { NivelEducacional } from '../model/nivel-educacional';
import { convertDateToString, convertStringToDate } from '../tools/date-functions';

// Interfaz para las filas de la tabla USUARIO
interface UsuarioRow {
  cuenta: string;
  correo: string;
  password: string;
  preguntaSecreta: string;
  respuestaSecreta: string;
  nombre: string;
  apellido: string;
  nivelEducacional: number;
  fechaNacimiento: string; 
  direccion: string;
}

@Injectable({
  providedIn: 'root',
})
export class databaseService {

  usuarioPrueba0 = Usuario.getNewUsuario(
    'admin',
    'admin@duocuc.cl',
    '1234',
    '¿Cuál es tu animal favorito?',
    'gato',
    'Administrador',
    'del Sistema',
    NivelEducacional.buscarNivelEducacional(6)!,
    new Date(2000, 0, 5),
    'Santiago Centro'
  );

  usuarioPrueba1 = Usuario.getNewUsuario(
    'atorres',
    'atorres@duocuc.cl',
    '1234',
    '¿Cuál es tu animal favorito?',
    'gato',
    'Ana',
    'Torres',
    NivelEducacional.buscarNivelEducacional(6)!,
    new Date(2000, 1, 5),
    'La Florida'
  );

  usuarioPrueba2 = Usuario.getNewUsuario(
    'jperez',
    'jperez@duocuc.cl',
    '5678',
    '¿Cuál es tu postre favorito?',
    'panqueques',
    'Juan',
    'Pérez',
    NivelEducacional.buscarNivelEducacional(5)!,
    new Date(2000, 1, 10),
    'La Pintana'
  );

  usuarioPrueba3 = Usuario.getNewUsuario(
    'cmujica',
    'cmujica@duocuc.cl',
    '0987',
    '¿Cuál es tu vehículo favorito?',
    'moto',
    'Carla',
    'Mujica',
    NivelEducacional.buscarNivelEducacional(6)!,
    new Date(2000, 2, 20),
    'Providencia'
  );

  userUpgrades = [
    {
      toVersion: 1,
      statements: [
        `
      CREATE TABLE IF NOT EXISTS USUARIO (
        cuenta TEXT PRIMARY KEY NOT NULL,
        correo TEXT NOT NULL,
        password TEXT NOT NULL,
        preguntaSecreta TEXT NOT NULL,
        respuestaSecreta TEXT NOT NULL,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        nivelEducacional INTEGER NOT NULL,
        fechaNacimiento TEXT NOT NULL,
        direccion TEXT NOT NULL
      );
      `,
      ],
    },
  ];

  sqlInsertUpdate = `
    INSERT OR REPLACE INTO USUARIO (
      cuenta,
      correo,
      password,
      preguntaSecreta,
      respuestaSecreta,
      nombre,
      apellido,
      nivelEducacional,
      fechaNacimiento,
      direccion
    ) VALUES (?,?,?,?,?,?,?,?,?,?);
  `;

  nombreBD = 'basedatos';
  db!: SQLiteDBConnection;
  listaUsuarios: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([]);
  datosQR: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private sqliteService: SQLiteService) {}

  async inicializarBaseDeDatos() {
    await this.sqliteService.crearBaseDeDatos({
      database: this.nombreBD,
      upgrade: this.userUpgrades,
    });
    this.db = await this.sqliteService.abrirBaseDeDatos(
      this.nombreBD,
      false,
      'no-encryption',
      1,
      false
    );
    await this.crearUsuariosDePrueba();
    await this.leerUsuarios();
  }

  async crearUsuariosDePrueba() {
    const usuariosDePrueba = [this.usuarioPrueba0, this.usuarioPrueba1, this.usuarioPrueba2, this.usuarioPrueba3];
    for (const usuario of usuariosDePrueba) {
      const existe = await this.leerUsuario(usuario.cuenta);
      if (!existe) {
        await this.guardarUsuario(usuario);
      }
    }
  }

  async guardarUsuario(usuario: Usuario): Promise<void> {
    const nivelEducacionalId = usuario.NivelEducacional?.id || null;
    if (!nivelEducacionalId) {
      throw new Error('Nivel Educacional no válido al intentar guardar el usuario.');
    }

    await this.db.run(this.sqlInsertUpdate, [
      usuario.cuenta,
      usuario.correo,
      usuario.password,
      usuario.preguntaSecreta,
      usuario.respuestaSecreta,
      usuario.Nombre,
      usuario.Apellido,
      nivelEducacionalId,
      convertDateToString(usuario.FechaNacimiento!),
      usuario.direccion
    ]);
    await this.leerUsuarios();
  }


  async leerUsuarios(): Promise<Usuario[]> {
    const q = 'SELECT * FROM USUARIO;';
    const rows = (await this.db.query(q)).values as UsuarioRow[];
    const usuarios: Usuario[] = rows.map((row) => this.convertirFilaAUsuario(row));
    this.listaUsuarios.next(usuarios);
    return usuarios;
  }

  async leerUsuario(cuenta: string): Promise<Usuario | undefined> {
    const q = 'SELECT * FROM USUARIO WHERE cuenta=?;';
    const rows = (await this.db.query(q, [cuenta])).values as UsuarioRow[];
    return rows.length ? this.convertirFilaAUsuario(rows[0]) : undefined;
  }

  async eliminarUsuarioUsandoCuenta(cuenta: string): Promise<void> {
    await this.db.run('DELETE FROM USUARIO WHERE cuenta=?', [cuenta]);
    await this.leerUsuarios();
  }

  async buscarUsuarioValido(cuenta: string, password: string): Promise<Usuario | undefined> {
    const q = 'SELECT * FROM USUARIO WHERE cuenta=? AND password=?;';
    const rows = (await this.db.query(q, [cuenta, password])).values as UsuarioRow[];
    return rows.length ? this.convertirFilaAUsuario(rows[0]) : undefined;
  }

  async buscarUsuarioPorCuenta(cuenta: string): Promise<Usuario | undefined> {
    const q = 'SELECT * FROM USUARIO WHERE cuenta=?;';
    const rows = (await this.db.query(q, [cuenta])).values;
    return rows? this.convertirFilaAUsuario(rows[0]) : undefined;
  }

  async buscarUsuarioPorCorreo(correo: string): Promise<Usuario | undefined> {
    try {
      const q = 'SELECT * FROM USUARIO WHERE correo=?;';
      const result = await this.db.query(q, [correo]);
      const rows = result.values;
  
      // Verifica si se encontró algún resultado en la consulta
      if (!rows || rows.length === 0) {
        console.log(`No se encontró ningún usuario con el correo: ${correo}`);
        return undefined; // Retorna undefined si no hay resultados
      }
  
      console.log('Usuario encontrado:', rows[0]);
      return this.convertirFilaAUsuario(rows[0]); // Llama a la función de conversión si hay resultados
    } catch (error) {
      console.error('Error al buscar el usuario en la base de datos:', error);
      throw error; // Lanza el error si es necesario, o maneja como prefieras
    }
  }
  

  private convertirFilaAUsuario(row: UsuarioRow): Usuario {
    if (!row) {
      console.error('La fila es undefined o null');
      return new Usuario(); // Maneja el caso de fila nula o indefinida, retorna un usuario vacío
    }
  
    // Imprime la fila para verificar su contenido
    console.log('Fila recibida:', row);
  
    const usuario = new Usuario();
    usuario.cuenta = row.cuenta ?? 'valorPorDefecto'; // Usa el operador nullish coalescing para manejar valores undefined
    usuario.correo = row.correo ?? '';
    usuario.password = row.password ?? '';
    usuario.preguntaSecreta = row.preguntaSecreta ?? '';
    usuario.respuestaSecreta = row.respuestaSecreta ?? '';
    usuario.Nombre = row.nombre ?? '';
    usuario.Apellido = row.apellido ?? '';
    usuario.NivelEducacional = NivelEducacional.buscarNivelEducacional(row.nivelEducacional) || new NivelEducacional();
    usuario.FechaNacimiento = convertStringToDate(row.fechaNacimiento ?? '');
    usuario.direccion = row.direccion ?? '';
  
    return usuario;
  }
  
}
