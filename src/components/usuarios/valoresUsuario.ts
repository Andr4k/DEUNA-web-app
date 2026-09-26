import { fechaCorta, hora } from "@/lib/formato";

/**
 * Cómo se muestra un valor del contrato que puede faltar.
 *
 * Son las tres reglas que la tabla repite en sus celdas —las zonas, el nivel de acceso
 * y el último acceso— y que viven acá para que las seis columnas no las reescriban y
 * se separen entre sí. El contrato manda `null` donde no hay dato, y un `null`
 * mostrado como cero, como lista vacía o como la fecha de alta es una afirmación falsa
 * sobre la cuenta.
 */

/** El texto que se muestra donde el contrato trae `null`. */
export const SIN_DATO = "Sin dato";

/**
 * Las zonas de un usuario: "Chapinero, Usaquén", o "Sin dato".
 *
 * El texto sale de `join` y no de una lista dibujada: la celda es una columna de una
 * tabla y una lista con viñetas la haría crecer sin decir más.
 */
export function zonasDe(zonas: string[] | null): string {
  return zonas === null || zonas.length === 0 ? SIN_DATO : zonas.join(", ");
}

/**
 * "25 sep · 10:43 a. m." o "Sin dato" para la cuenta que nunca entró.
 *
 * Va con el día además de la hora: el listado no está acotado a un rango de fechas, así
 * que una hora sola no se puede ubicar en el tiempo.
 */
export function ultimoAccesoDe(instante: string | null): string {
  return instante === null ? SIN_DATO : `${fechaCorta(instante)} · ${hora(instante)}`;
}
