import { KpiMetrica } from "@/components/calificaciones/KpiMetrica";
import { SIN_DATO } from "@/components/calificaciones/valoresCalificacion";
import { calificacion, numero, porcentaje } from "@/lib/formato";
import type { ResumenCalificacionesRestaurantes as Resumen } from "@/lib/tipos/calificaciones-restaurantes";

/**
 * Franja de seis indicadores de las calificaciones a restaurantes.
 *
 * Recibe la promesa y la espera acá adentro, así la pantalla no frena mientras los
 * números llegan.
 *
 * Seis tarjetas en un `xl:grid-cols-6`: son pocas y cortas, y en dos filas de tres el
 * operador compara peor los dos extremos —destacados y en alerta—, que es justo la
 * comparación que viene a hacer. Debajo de `xl` caen a dos columnas.
 *
 * Tres tarjetas llevan la variación que trae el resumen —el promedio contra el período
 * anterior en puntos, y el total y el hoy en porcentaje—, y las tres la pasan en crudo:
 * un delta calculado en el frontend sería otro cálculo de lo mismo, y podría decir un
 * número distinto del que el backend usó para el suyo. Cuando el resumen la manda en
 * `null` la tarjeta dice "Sin dato" en gris, nunca un 0% en verde.
 */
export async function ResumenCalificaciones({ datos }: { datos: Promise<Resumen> }) {
  const resumen = await datos;

  return (
    <section
      aria-label="Resumen de calificaciones"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6"
    >
      <KpisDeVolumen resumen={resumen} />
      <KpisDeAtencion resumen={resumen} />
    </section>
  );
}

/** Cuánto se está calificando: el promedio, la cobertura, el total y el hoy. */
function KpisDeVolumen({ resumen }: { resumen: Resumen }) {
  const { variaciones } = resumen;
  const promedio = resumen.promedioGlobal;

  return (
    <>
      <KpiMetrica
        icono="estrella"
        colorIcono="text-alerta"
        etiqueta="Calificación promedio global"
        valor={promedio === null ? SIN_DATO : calificacion(promedio)}
        sufijo={promedio === null ? undefined : "/ 5"}
        contexto={textoBase(resumen.totalCalificaciones)}
        variacion={puntos(variaciones.promedioVsPeriodoAnterior)}
        comparacion="vs período anterior"
        baja={variaciones.promedioVsPeriodoAnterior !== null && variaciones.promedioVsPeriodoAnterior < 0}
        neutro={variaciones.promedioVsPeriodoAnterior === null}
      />
      <KpiMetrica
        icono="tienda"
        colorIcono="text-morado"
        etiqueta="Restaurantes calificados"
        valor={numero(resumen.restaurantesCalificados)}
        sufijo={`/ ${numero(resumen.restaurantesTotales)}`}
        contexto={textoCobertura(resumen.restaurantesCalificados, resumen.restaurantesTotales)}
      />
      <KpiMetrica
        icono="mensaje"
        colorIcono="text-info"
        etiqueta="Total calificaciones"
        valor={numero(resumen.totalCalificaciones)}
        variacion={porcentual(variaciones.totalVsPeriodoAnterior)}
        comparacion="vs período anterior"
        baja={variaciones.totalVsPeriodoAnterior !== null && variaciones.totalVsPeriodoAnterior < 0}
        neutro={variaciones.totalVsPeriodoAnterior === null}
      />
      <KpiMetrica
        icono="tendencia"
        colorIcono="text-exito"
        etiqueta="Calificaciones hoy"
        valor={numero(resumen.calificacionesHoy)}
        variacion={porcentual(variaciones.hoyVsAyer)}
        comparacion="vs ayer"
        baja={variaciones.hoyVsAyer !== null && variaciones.hoyVsAyer < 0}
        neutro={variaciones.hoyVsAyer === null}
      />
    </>
  );
}

/**
 * Los dos extremos: a quién hay que cuidar y a quién hay que copiarle.
 *
 * El umbral se muestra con el número que trae el contrato (`destacados.minimo`,
 * `enAlerta.maximo`) y no con un 4,7 escrito acá: si el backend lo ajusta, la tarjeta
 * se ajusta sola y no queda un "4,7 o más" contradiciendo el conteo de al lado.
 */
function KpisDeAtencion({ resumen }: { resumen: Resumen }) {
  return (
    <>
      <KpiMetrica
        icono="premio"
        colorIcono="text-acento"
        etiqueta="Restaurantes destacados"
        valor={numero(resumen.destacados.cantidad)}
        contexto={`Con promedio ≥ ${calificacion(resumen.destacados.minimo)}`}
      />
      <KpiMetrica
        icono="alerta"
        colorIcono="text-peligro"
        etiqueta="Restaurantes en alerta"
        valor={numero(resumen.enAlerta.cantidad)}
        contexto={`Con promedio ≤ ${calificacion(resumen.enAlerta.maximo)}`}
      />
    </>
  );
}

/** "Basado en 1 calificación" / "Basado en 3.427 calificaciones". */
function textoBase(cantidad: number): string {
  return cantidad === 1
    ? "Basado en 1 calificación"
    : `Basado en ${numero(cantidad)} calificaciones`;
}

/** "80,6% del total de restaurantes"; sin restaurantes activos no hay porcentaje. */
function textoCobertura(calificados: number, totales: number): string {
  if (totales === 0) return SIN_DATO;
  return `${porcentaje((calificados / totales) * 100, 1)} del total de restaurantes`;
}

/**
 * La diferencia del promedio en puntos ("0,3"), que NO es un porcentaje: el promedio va
 * de 1 a 5 y así es como se lee. El signo va en la flecha de la tarjeta, no en el texto.
 */
function puntos(valor: number | null): string {
  return valor === null ? SIN_DATO : calificacion(Math.abs(valor));
}

/** Una variación porcentual ("15,7%" / "12,1%"); `null` es "sin dato", no un 0%. */
function porcentual(valor: number | null): string {
  return valor === null ? SIN_DATO : porcentaje(Math.abs(valor), 1);
}