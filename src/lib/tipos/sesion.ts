/** Sesión del portal — contratos de autenticación. */

/**
 * Roles canónicos del backend (`Deuna.Shared.Security.Roles`).
 *
 * El portal NO los inventa: llegan en el claim `role` del JWT y un desajuste de
 * mayúsculas produce 403 en silencio.
 */
export const ROLES = ["RESTAURANT", "RIDER", "ADMIN", "CUSTOMER"] as const;

export type Rol = (typeof ROLES)[number];

/**
 * Roles que pueden entrar al portal.
 *
 * El domiciliario y el cliente quedan afuera a propósito: tienen su propia app y
 * no tienen nada que hacer en el backoffice. Si un RIDER acierta la contraseña,
 * el portal lo rechaza igual — el rol es parte de la autorización, no un detalle
 * de la interfaz.
 */
export const ROLES_DEL_PORTAL: readonly Rol[] = ["ADMIN", "RESTAURANT"];

/** Usuario con la sesión abierta, tal como lo necesita la interfaz. */
export interface UsuarioSesion {
  id: string;
  email: string;
  rol: Rol;
  /** Nombre para mostrar. Si el backend no lo trae, se usa el email. */
  nombre: string;
}

/** Lo que se guarda en la cookie de sesión. */
export interface SesionPortal {
  accessToken: string;
  refreshToken: string;
  /** ISO 8601. El middleware la usa para no dejar pasar un token vencido. */
  expiraEn: string;
  usuario: UsuarioSesion;
}
