/**
 * Usuario en sesión.
 *
 * TODO: reemplazar por la sesión real. El backend (Identity) entrega el rol y
 * el nombre dentro del JWT; hasta que exista el flujo de login en el portal,
 * esto es lo que muestran la barra superior y el pie de la barra lateral.
 */
export const USUARIO_ACTUAL = {
  nombre: "Carlos Rodríguez",
  rol: "Administrador",
  /** Iniciales para el avatar mientras no haya foto de perfil. */
  iniciales: "CR",
} as const;
