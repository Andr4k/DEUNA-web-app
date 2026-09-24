import { USUARIO_ACTUAL } from "@/lib/sesion";

interface Props {
  /** 36px por defecto (pie de la barra lateral), 32px en la barra superior. */
  tamano?: number;
}

/**
 * Avatar del usuario.
 *
 * Mientras no haya foto de perfil se dibujan las iniciales sobre el color de
 * marca: es preferible a un cuadrado gris, y no depende de una imagen externa.
 */
export function Avatar({ tamano = 36 }: Props) {
  return (
    <span
      aria-hidden="true"
      style={{ width: tamano, height: tamano, fontSize: tamano * 0.38 }}
      className="grid shrink-0 place-items-center rounded-full border border-borde bg-panel-alt font-semibold text-acento"
    >
      {USUARIO_ACTUAL.iniciales}
    </span>
  );
}
