interface Props {
  /** Iniciales del usuario en sesión. */
  iniciales: string;
  /** 36px por defecto (pie de la barra lateral), 32px en la barra superior. */
  tamano?: number;
}

/**
 * Avatar del usuario.
 *
 * Mientras no haya foto de perfil se dibujan las iniciales sobre el color de
 * marca: es preferible a un cuadrado gris, y no depende de una imagen externa.
 *
 * Las iniciales llegan por props y no de un módulo global: así el avatar sirve
 * para cualquier usuario (el de la sesión, o el de una tabla de usuarios).
 */
export function Avatar({ iniciales, tamano = 36 }: Props) {
  return (
    <span
      aria-hidden="true"
      style={{ width: tamano, height: tamano, fontSize: tamano * 0.38 }}
      className="grid shrink-0 place-items-center rounded-full border border-borde bg-panel-alt font-semibold text-acento"
    >
      {iniciales}
    </span>
  );
}
