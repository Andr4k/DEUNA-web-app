import type { ReactNode } from "react";

import { Icono } from "@/components/ui/Icono";

interface Props {
  /** Icono del set. Por defecto, el de información. */
  icono?: string;
  titulo: string;
  /** Qué puede hacer el usuario para salir de este estado. */
  descripcion?: string;
  accion?: ReactNode;
}

/**
 * Estado vacío.
 *
 * Una pantalla sin resultados no puede quedar en blanco: el usuario no distingue
 * "no hay datos" de "algo se rompió". Acá se dice qué pasó y qué hacer.
 */
export function EstadoVacio({
  icono = "info",
  titulo,
  descripcion,
  accion,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <span className="grid size-11 place-items-center rounded-full border border-borde bg-panel-alt text-texto-3">
        <Icono nombre={icono} tamano={22} />
      </span>
      <p className="m-0 text-sm font-semibold">{titulo}</p>
      {descripcion ? <p className="m-0 max-w-sm text-[13px] text-texto-2">{descripcion}</p> : null}
      {accion ? <div className="mt-2">{accion}</div> : null}
    </div>
  );
}
