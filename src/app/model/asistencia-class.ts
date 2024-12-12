import { showAlert, showAlertError } from "../tools/message-functions";

export class AsistenciaClass {

  static jsonClassExample =
    `{
      "bloqueInicio": 7,
      "bloqueTermino": 9,
      "dia": "2022-08-09",
      "horaInicio": "13:00",
      "horaFin": "15:15",
      "idAsignatura": "PGY4121",
      "nombreAsignatura": "Aplicaciones Móviles",
      "nombreProfesor": "Cristián Gómez Vega",
      "seccion": "001D",
      "sede": "Alonso Ovalle"
    }`;
  
    static jsonClassEmpty =
    `{
      bloqueInicio = '';
    bloqueTermino= '';
    dia= '';
    horaFin= '';
    horaInicio= '';
    idAsignatura= '';
    nombreAsignatura= '';
    nombreProfesor= '';
    seccion= '';
    sede= '';""
    }`;

    bloqueInicio = '';
    bloqueTermino= '';
    dia= '';
    horaFin= '';
    horaInicio= '';
    idAsignatura= '';
    nombreAsignatura= '';
    nombreProfesor= '';
    seccion= '';
    sede= '';

  constructor() { }

  public static getNewAsistencia(
    bloqueInicio: string,
    bloqueTermino: string,
    dia: string,
    horaFin: string,
    horaInicio: string,
    idAsignatura: string,
    nombreAsignatura: string,
    nombreProfesor: string,
    seccion: string,
    sede: string
  ) {
    const asistencia = new AsistenciaClass();
    asistencia.bloqueInicio = bloqueInicio;
    asistencia.bloqueTermino = bloqueTermino;
    asistencia.dia = dia;
    asistencia.horaInicio = horaInicio;
    asistencia.horaFin = horaFin;
    asistencia.idAsignatura = idAsignatura;
    asistencia.nombreAsignatura = nombreAsignatura;
    asistencia.nombreProfesor = nombreProfesor;
    asistencia.seccion = seccion;
    asistencia.sede = sede;
    return asistencia;
  }


  static isValidAsistenciaQrCode(qr: string) {
    if (qr === '') return false;

    try {
      const json = JSON.parse(qr);

      if (json.bloqueInicio !== undefined
        && json.bloqueTermino !== undefined
        && json.dia !== undefined
        && json.horaInicio !== undefined
        && json.horaFin !== undefined
        && json.idAsignatura !== undefined
        && json.nombreAsignatura !== undefined
        && json.nombreProfesor !== undefined
        && json.seccion !== undefined
        && json.sede !== undefined
      ) {
        return true;
      }
    } catch (error) { }

    showAlert('El código QR escaneado no corresponde a un Asistencia de Clases');
    return false;
  }
  
}
