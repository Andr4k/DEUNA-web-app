import type { ReactNode } from "react";

/**
 * Set de iconos del portal.
 *
 * Vive en `lib/` y no en `components/ui/` por dos motivos:
 *
 * 1. Es una lista de DATOS (los trazados SVG), no un componente. Pesa lo que
 *    pesa y crece cada vez que se necesita un icono nuevo.
 * 2. `lib/navegacion.ts` necesita el tipo `NombreIcono` para tipar los iconos
 *    del menú. Si el tipo viviera en `components/`, `lib/` dependería de la UI,
 *    que es exactamente al revés de como van las dependencias.
 *
 * Son siluetas de trazo (estilo Lucide), no rellenos: el `stroke` sale de
 * `currentColor`, así que el color se controla con la clase de texto del padre
 * (`text-exito`, `text-alerta`, ...). Si se agregara un relleno habría que
 * pintarlo con `fill` explícito, como hace la estrella.
 */
export const TRAZOS: Record<string, ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  pedidos: (
    <>
      <rect x="8" y="3" width="8" height="4" rx="1" />
      <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </>
  ),
  tienda: (
    <>
      <path d="M3 9.5 4.5 4h15L21 9.5" />
      <path d="M4 9.5V20h16V9.5" />
      <path d="M3 9.5h18" />
      <path d="M9 20v-5h6v5" />
    </>
  ),
  moto: (
    <>
      <circle cx="5.5" cy="17.5" r="3" />
      <circle cx="18.5" cy="17.5" r="3" />
      <path d="M8.5 17.5h6l3-9h-4" />
      <path d="M11 8.5h3" />
    </>
  ),
  usuario: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-3.5 4.2-5 7.5-5s6 1.5 7.5 5" />
    </>
  ),
  alerta: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16.5h.01" />
    </>
  ),
  dinero: (
    <>
      <rect x="2.5" y="6.5" width="19" height="11" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 10v4" />
      <path d="M18 10v4" />
    </>
  ),
  estrella: (
    <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.7l5.9-.8z" />
  ),
  megafono: (
    <>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z" />
      <path d="M14 8.5a4 4 0 0 1 0 7" />
      <path d="M17 6a7 7 0 0 1 0 12" />
    </>
  ),
  reportes: (
    <>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </>
  ),
  config: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" />
    </>
  ),
  ayuda: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.6" />
      <path d="M12 17h.01" />
    </>
  ),
  calendario: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  campana: (
    <>
      <path d="M18 15V10a6 6 0 1 0-12 0v5l-1.5 3h15z" />
      <path d="M10 21h4" />
    </>
  ),
  mas: <path d="M12 5v14M5 12h14" />,
  bolsa: (
    <>
      <path d="M5 7.5h14l1 12.5H4z" />
      <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.5 2.5L16 9.5" />
    </>
  ),
  triangulo: (
    <>
      <path d="M12 4 2.5 20h19z" />
      <path d="M12 10v4" />
      <path d="M12 17.5h.01" />
    </>
  ),
  dolar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10" />
      <path d="M14.5 9.5a2.5 2.5 0 0 0-2.5-1.5c-1.4 0-2.5.8-2.5 2s1.1 1.8 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2a2.5 2.5 0 0 1-2.5-1.5" />
    </>
  ),
  reloj: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <path d="M12 7.5h.01" />
    </>
  ),
  flecha: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  "flecha-arriba": (
    <>
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </>
  ),
  "flecha-abajo": (
    <>
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </>
  ),
  "chevron-izquierda": <path d="m14.5 5-7 7 7 7" />,
  "chevron-derecha": <path d="m9.5 5 7 7-7 7" />,
  "chevron-abajo": <path d="m5 9.5 7 7 7-7" />,
  salir: (
    <>
      <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  // Los tres del rediseño de métricas de calificaciones. Van dibujados con la misma
  // rejilla de 24 y sin relleno, como el resto: el grosor lo pone el componente.
  mensaje: (
    <path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 20l1.8-4.9A7.5 7.5 0 1 1 20 11.5z" />
  ),
  tendencia: (
    <>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7.5 15.5l3.5-4 2.6 2.6L20 7.5" />
      <path d="M16.5 7.5H20V11" />
    </>
  ),
  premio: (
    <>
      <path d="M7 4h10v5.5a5 5 0 0 1-10 0z" />
      <path d="M7 5.5H4.5V7a3 3 0 0 0 2.7 3" />
      <path d="M17 5.5h2.5V7a3 3 0 0 1-2.7 3" />
      <path d="M10 14.5V17l-2 4h8l-2-4v-2.5" />
    </>
  ),
};

/** Iconos que se pintan rellenos en lugar de trazados. */
export const RELLENOS = new Set(["estrella"]);

export type NombreIcono = keyof typeof TRAZOS;
