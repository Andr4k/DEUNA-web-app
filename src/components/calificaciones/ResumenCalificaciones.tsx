import { SIN_DATO } from "@/components/calificaciones/valoresCalificacion";
import { Kpi } from "@/components/ui/Kpi";
import { calificacion, numero } from "@/lib/formato";
import type { ResumenCalificacionesRestaurantes as Resumen } from "@/lib/tipos/calificaciones-restaurantes";

/**
 * Fila de seis indicadores de las calificaciones a restaurantes.
 *
 * Recibe la promesa y la espera acá adentro, así la pantalla no frena mientras los
 * números llegan.
 *
 * Seis tarjetas en un `xl:grid-cols-6`: son pocas y cortas, y en dos filas de tres el
 * operador compara peor los dos extremos —destacados y en alerta—, que es justo la
 * comparación que viene a hacer. Debajo de `xl` caen a dos columnas.
 *
 * Ninguna tarjeta lleva tendencia: el contrato del resumen no trae la comparación
 * contra el período anterior, y una fila "vs ayer" calculada en el frontend sería otro
 * cálculo de lo mismo —el que el contrato justamente evita—.
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
  return (
    <>
      <Kpi
        icono="estrella"
        colorIcono="text-alerta"
        etiqueta="Calificación promedio"
        valor={resumen.promedioGlobal === null ? SIN_DATO : calificacion(resumen.promedioGlobal)}
        periodo={textoBase(resumen.totalCalificaciones)}
      />
      <Kpi
        icono="tienda"
        colorIcono="text-info"
        etiqueta="Restaurantes calificados"
        valor={`${numero(resumen.restaurantesCalificados)} / ${numero(resumen.restaurantesTotales)}`}
        periodo="Sobre el total de restaurantes activos"
      />
      <Kpi
        icono="reportes"
        colorIcono="text-morado"
        etiqueta="Calificaciones"
        valor={numero(resumen.totalCalificaciones)}
        periodo="En el rango y la zona filtrados"
      />
      <Kpi
        icono="reloj"
        colorIcono="text-info"
        etiqueta="Calificaciones hoy"
        valor={numero(resumen.calificacionesHoy)}
        periodo="Hoy"
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
      <Kpi
        icono="flecha-arriba"
        colorIcono="text-exito"
        etiqueta="Destacados"
        valor={numero(resumen.destacados.cantidad)}
        periodo={`${calificacion(resumen.destacados.minimo)} o más`}
      />
      <Kpi
        icono="triangulo"
        colorIcono="text-peligro"
        etiqueta="En alerta"
        valor={numero(resumen.enAlerta.cantidad)}
        periodo={`${calificacion(resumen.enAlerta.maximo)} o menos`}
      />
    </>
  );
}

/** "Sobre 1 calificación" / "Sobre 1.284 calificaciones". */
function textoBase(cantidad: number): string {
  return cantidad === 1
    ? "Sobre 1 calificación"
    : `Sobre ${numero(cantidad)} calificaciones`;
}
