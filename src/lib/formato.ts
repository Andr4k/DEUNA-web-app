/**
 * Formateo de valores para mostrar.
 *
 * Todo pasa por acá para que el portal no mezcle formatos: el mismo peso se
 * escribe igual en el panel, en una tabla y en un reporte.
 */

const MONEDA = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const NUMERO = new Intl.NumberFormat("es-CO");

const HORA = new Intl.DateTimeFormat("es-CO", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const FECHA_CORTA = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
});

const CALIFICACION = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** $234.000 */
export function moneda(valor: number): string {
  return MONEDA.format(valor);
}

/** 1.284 */
export function numero(valor: number): string {
  return NUMERO.format(valor);
}

/** 10:43 a. m. */
export function hora(fecha: string | Date): string {
  return HORA.format(typeof fecha === "string" ? new Date(fecha) : fecha);
}

/** 94% */
export function porcentaje(valor: number, decimales = 0): string {
  return `${valor.toFixed(decimales)}%`;
}

/**
 * 4,6 — una calificación con un decimal.
 *
 * Las notas son 1..5 y se muestran siempre con el mismo decimal: sin eso, un 4 y un
 * 4,0 se leen como cosas distintas en dos columnas de la misma tabla.
 */
export function calificacion(valor: number): string {
  return CALIFICACION.format(valor);
}

/** "25 sep" — la fecha sin el año, para listas donde el año no cambia la lectura. */
export function fechaCorta(fecha: string | Date): string {
  return FECHA_CORTA.format(typeof fecha === "string" ? new Date(fecha) : fecha);
}

/** "15 min" / "1 h 5 min" */
export function duracion(minutos: number | null): string {
  if (minutos === null) return "-";
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
}

/** "21 de mayo de 2025" */
export function fechaLarga(fecha: string | Date): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(typeof fecha === "string" ? new Date(fecha) : fecha);
}

/** "▲ 18%" o "▼ 2", según el signo. El símbolo es parte del dato, no del estilo. */
export function variacion(valor: number, sufijo = "%"): string {
  const flecha = valor >= 0 ? "▲" : "▼";
  return `${flecha} ${Math.abs(valor)}${sufijo}`;
}

/** "▲ $9.000" — igual que `variacion`, pero con la cifra en pesos. */
export function variacionMoneda(valor: number): string {
  const flecha = valor >= 0 ? "▲" : "▼";
  return `${flecha} ${MONEDA.format(Math.abs(valor))}`;
}

/**
 * Variación porcentual contra el período anterior, redondeada.
 *
 * Devuelve `null` cuando el período anterior es 0, y eso NO es un cero: sin base no
 * hay porcentaje, y un -100% (o un +∞) sería una afirmación falsa sobre el día. Quien
 * la muestra tiene que decir "sin dato".
 */
export function variacionPorcentual(actual: number, anterior: number): number | null {
  if (anterior === 0) return null;
  return Math.round(((actual - anterior) / anterior) * 100);
}
