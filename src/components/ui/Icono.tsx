import type { SVGProps } from "react";

import { RELLENOS, TRAZOS, type NombreIcono } from "@/lib/iconos";

interface Props extends Omit<SVGProps<SVGSVGElement>, "name"> {
  /**
   * Nombre del icono. Es `NombreIcono` y no `string` a proposito: con `string`,
   * escribir mal un nombre compila y el icono desaparece en tiempo de ejecucion.
   * Asi el error aparece al compilar, que es cuando sale barato.
   */
  nombre: NombreIcono;
  /** Tamano en pixeles. 18 por defecto; 15 en listas, 22 en destacados. */
  tamano?: number;
}

/**
 * Icono del portal.
 *
 * El componente es solo el envoltorio del SVG: los trazados viven en
 * `lib/iconos.tsx` (son datos, no logica). Aca se resuelve el color por
 * `currentColor`, el tamano y el caso de los pocos iconos rellenos.
 */
export function Icono({ nombre, tamano = 18, className = "", ...resto }: Props) {
  const contenido = TRAZOS[nombre];
  if (!contenido) {
    // Un icono que no existe se nota: mejor un hueco visible que un error silencioso.
    console.warn(`Icono desconocido: ${nombre}`);
    return null;
  }

  const relleno = RELLENOS.has(nombre);

  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={relleno ? "currentColor" : "none"}
      stroke={relleno ? "none" : "currentColor"}
      strokeWidth={relleno ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      {...resto}
    >
      {contenido}
    </svg>
  );
}
