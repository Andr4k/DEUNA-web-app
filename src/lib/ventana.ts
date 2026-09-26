/**
 * La ventana de fechas de un listado.
 *
 * El operador piensa en DÍAS de calendario de Colombia y los contratos del backend
 * quieren INSTANTES ISO donde el rango cierra por la izquierda de forma inclusiva
 * (`>= desde`) y por la derecha de forma EXCLUSIVA (`< hasta`). La traducción vive acá y
 * no en cada pantalla porque es una decisión del contrato, no de la vista: si viviera en
 * la pantalla, cada una tendría que acordarse del huso y de la exclusividad, y dos
 * pantallas que miran el mismo día podrían terminar pidiendo rangos distintos.
 *
 * Colombia es UTC-05:00 todo el año —no hay horario de verano que desfase el cálculo—,
 * así que un día se traduce a su medianoche en ese huso y desplazarlo 24 h no le cambia
 * la hora.
 */

/** El huso del país, en las dos formas que hacen falta: el texto ISO y los milisegundos. */
const HUSO = "-05:00";
const DESFASE = 5 * 60 * 60 * 1000;

/**
 * El día que eligió el operador, convertido al instante que espera el contrato.
 *
 * `diasDesplazados` es 0 para `desde` y 1 para `hasta`, que es como se cierra el rango
 * por la derecha sin dejar afuera el final del día. Un día que no se puede parsear
 * devuelve `null`: mandarle un `Invalid Date` a la API es peor que no mandar el filtro.
 */
export function instanteDelDia(dia: string | undefined, diasDesplazados = 0): string | null {
  if (!dia) return null;

  const fecha = new Date(`${dia}T00:00:00${HUSO}`);
  if (Number.isNaN(fecha.getTime())) return null;

  if (diasDesplazados) fecha.setTime(fecha.getTime() + diasDesplazados * 86_400_000);
  return fecha.toISOString();
}

/**
 * Un día que viene en la URL, si de verdad es un día.
 *
 * Se exige la forma `YYYY-MM-DD` —`25/09/2026` o `ayer` no son días— y que la fecha
 * exista: `2026-02-31` tiene la forma correcta y no es un día, y JavaScript lo corre al
 * 3 de marzo. Mandarlo al backend devolvería un 400 por una ventana que el operador
 * nunca pidió, así que lo que no se puede leer se trata como ausente, igual que un
 * número que no es número.
 */
export function diaValido(valor: string | undefined): string | undefined {
  if (!valor || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return undefined;
  return desplazarDias(valor, 0) === valor ? valor : undefined;
}

/**
 * Los últimos `dias` días, contando hoy, en la forma que se escribe en la URL.
 *
 * `hasta` es el día de hoy porque el contrato cierra el rango de forma exclusiva: el
 * rango llega hasta el final del día. Se devuelve como días (`YYYY-MM-DD`) y no como
 * instantes para que se pueda escribir tal cual en la URL y el enlace se lea.
 */
export function ventanaDeDias(dias: number): { desde: string; hasta: string } {
  const hoy = diaEnColombia();

  return { desde: desplazarDias(hoy, -(dias - 1)), hasta: hoy };
}

/** El día colombiano de un instante —o de ahora—, en la forma `YYYY-MM-DD`. */
function diaEnColombia(instante: number = Date.now()): string {
  return new Date(instante - DESFASE).toISOString().slice(0, 10);
}

/** El día desplazado `dias` días; un día que no existe no vuelve igual, y eso lo delata. */
function desplazarDias(dia: string, dias: number): string {
  const fecha = new Date(`${dia}T00:00:00${HUSO}`);
  if (Number.isNaN(fecha.getTime())) return "";

  fecha.setTime(fecha.getTime() + dias * 86_400_000);
  return diaEnColombia(fecha.getTime());
}
