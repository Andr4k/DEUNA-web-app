import type { ReactNode } from "react";

interface Props {
  titulo: string;
  /** Acción a la derecha, normalmente un `<EnlaceAccion />`. */
  accion?: ReactNode;
}

/**
 * Encabezado de una sección del contenido (no el de una tarjeta).
 *
 * Es la fila "TÍTULO … Ver todos →" que separa bloques dentro de una pantalla.
 * Se extrajo para que el espaciado y el tamaño del título sean los mismos en
 * todas las secciones y no se ajusten a mano en cada una.
 */
export function EncabezadoSeccion({ titulo, accion }: Props) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="m-0 text-xs font-semibold tracking-[0.05em] text-texto-2 uppercase">
        {titulo}
      </h2>
      {accion}
    </div>
  );
}
