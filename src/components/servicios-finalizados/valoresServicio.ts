import { calificacion, hora } from "@/lib/formato";

/**
 * Cómo se muestra un valor del contrato que puede faltar.
 *
 * Son tres reglas que la tabla repite en varias celdas —una hora, una nota, un
 * extremo ausente— y que viven acá para que las nueve columnas no las reescriban y se
 * separen entre sí. El contrato manda `null` donde no hay dato, y un `null` mostrado
 * como cero o como una fecha inventada es una afirmación falsa sobre el servicio.
 */

/** Un extremo que puede faltar se muestra con guion. */
const GUION = "—";

/** "★ 4,6" o "Sin calificar": una nota que no existe no se muestra como cero. */
export function estrella(nota: number | null): string {
  return nota === null ? "Sin calificar" : `★ ${calificacion(nota)}`;
}

/** Una hora que puede faltar (el pedido cerró sin asignación o sin escaneo del QR). */
export function horaDe(instante: string | null): string {
  return instante === null ? GUION : hora(instante);
}
