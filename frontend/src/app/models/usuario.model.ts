export enum Rol {
  Admin = 'admin',
  Usuario = 'usuario'
}

export interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  rol: Rol;
}

// Respuesta del backend al iniciar sesión o registrarse
export interface RespuestaAuth {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

export interface CredencialesLogin {
  email: string;
  password: string;
}

export interface DatosRegistro extends CredencialesLogin {
  nombre: string;
}

// Forma de los errores que devuelve la API
export interface ErrorApi {
  mensaje?: string;
  errores?: string[];
  codigo?: string;
}
