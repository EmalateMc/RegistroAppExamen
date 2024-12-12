import { NivelEducacional } from './nivel-educacional';
import { Usuario } from './usuario';

export class Persona {

  public Nombre;
  public Apellido;
  public NivelEducacional: NivelEducacional;
  public FechaNacimiento: Date | undefined;
  public direccion: string;

  constructor() {
    this.Nombre = '';
    this.Apellido = '';
    this.NivelEducacional = NivelEducacional.buscarNivelEducacional(1)!;
    this.FechaNacimiento = new Date();
    this.direccion = '';
  }

  // Formatear la fecha de nacimiento en dd/mm/yyyy
  public getFechaNacimiento(): string {
    if (!this.FechaNacimiento) return 'No asignada';

    const day = this.FechaNacimiento.getDate().toString().padStart(2, '0');
    // Obtener el mes (agregando 1) y agregar un cero inicial si es necesario
    const month = (this.FechaNacimiento.getMonth() + 1).toString().padStart(2, '0');
    // Obtener el año
    const year = this.FechaNacimiento.getFullYear();
    return `${day}/${month}/${year}`;
  }

}
