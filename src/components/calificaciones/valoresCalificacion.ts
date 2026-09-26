import { calificacion } from "@/lib/formato";

/**
 * Cómo se muestra un valor del contrato que puede faltar.
 *
 * El contrato de calificaciones manda `null` en tres lugares —el tipo de comida, las
 * incidencias y la tendencia— y en los tres un cero sería una afirmación falsa: un
 * restaurante sin tipo de comida asignado no es un restaurante de comida "0", y una
 * tendencia de 0 puntos es una tendencia plana, que es otra cosa. Por eso los tres
 * caen acá y no en la celda de cada columna.
 */

/** El texto que se muestra donde el contrato trae `null`. */
export const SIN_DATO = "Sin dato";

/** "4,6" o "Sin dato": una nota que no existe no se muestra como cero. */
export function nota(valor: number | null): string {
  return valor === null ? SIN_DATO : calificacion(valor);
}

/** "★ 4,6" para las filas donde la estrella ayuda a leer que es una calificación. */
export function notaConEstrella(valor: number | null): string {
  return valor === null ? SIN_DATO : `★ ${calificacion(valor)}`;
}

/**
 * Un texto opcional del contrato: `tipoDeComida` hoy siempre viene en `null` porque no
 * existe la fuente, y se muestra "Sin dato" en lugar de una celda vacía —una celda
 * vacía se lee como "no aplica", que es distinto de "todavía no lo sabemos"—.
 */
export function textoOpcional(valor: string | null): string {
  return valor ?? SIN_DATO;
}

/** Un conteo opcional del contrato: `incidencias` hoy siempre viene en `null`. */
export function conteoOpcional(valor: number | null): string {
  return valor === null ? SIN_DATO : String(valor);
}

/**
 * El color de cada nivel de estrella, del mejor al peor.
 *
 * Es un `Record` y no un ternario en el render: las cinco barras y la barra apilada de
 * la tabla tienen que usar la MISMA escala, si no el mismo 4★ se ve de dos colores
 * según dónde esté.
 */
export const COLOR_ESTRELLA: Record<1 | 2 | 3 | 4 | 5, string> = {
  5: "bg-exito",
  4: "bg-info",
  3: "bg-alerta",
  2: "bg-morado",
  1: "bg-peligro",
};

/**
 * La MISMA escala, en la forma que necesita el trazo de un SVG (el donut de la
 * distribución). Va aparte porque una utilidad de Tailwind tiene que estar escrita en
 * el código para que el compilador la genere: `bg-` no se puede armar en tiempo de
 * ejecución. Las dos listas son el mismo nivel→color, así que si cambia una cambia la
 * otra — el 5 verde y el 1 rojo en todas partes.
 */
export const COLOR_ESTRELLA_TRAZO: Record<1 | 2 | 3 | 4 | 5, string> = {
  5: "var(--color-exito)",
  4: "var(--color-info)",
  3: "var(--color-alerta)",
  2: "var(--color-morado)",
  1: "var(--color-peligro)",
};

/** Los cinco niveles, de 5 a 1: el orden en que se leen la distribución y la barra. */
export const NIVELES: (1 | 2 | 3 | 4 | 5)[] = [5, 4, 3, 2, 1];

/** Cuántas calificaciones hay en la distribución, sumando los cinco niveles. */
export function totalDe(distribucion: {
  cinco: number;
  cuatro: number;
  tres: number;
  dos: number;
  una: number;
}): number {
  return distribucion.cinco + distribucion.cuatro + distribucion.tres + distribucion.dos + distribucion.una;
}

/** El conteo de un nivel, para no repetir el `switch` en cada bloque. */
export function conteoDe(
  distribucion: {
    cinco: number;
    cuatro: number;
    tres: number;
    dos: number;
    una: number;
  },
  nivel: 1 | 2 | 3 | 4 | 5,
): number {
  const nombres = {
    5: "cinco",
    4: "cuatro",
    3: "tres",
    2: "dos",
    1: "una",
  } as const;

  return distribucion[nombres[nivel]];
}
