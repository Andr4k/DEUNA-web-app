import { Kpi } from "@/components/ui/Kpi";
import {
  calificacion,
  duracion,
  moneda,
  numero,
  variacion,
  variacionPorcentual,
} from "@/lib/formato";
import type {
  ResumenServiciosFinalizados as Resumen,
  RespuestaServiciosFinalizados,
} from "@/lib/tipos/servicios-finalizados";

/** Las variaciones contra ayer, ya en porcentaje (o `null` si ayer no tiene base). */
interface Variaciones {
  completados: number | null;
  valor: number | null;
  tiempo: number | null;
}

/**
 * Fila de indicadores del historial de servicios finalizados.
 *
 * Recibe la promesa y la espera acá adentro, así la pantalla no frena mientras los
 * números llegan. Los cinco indicadores salen del MISMO conjunto que las filas —por eso
 * viajan en la misma respuesta—, y eso es lo que impide el contador que dice 42 con una
 * lista de 38.
 *
 * Se usa el `Kpi` de `ui/` y no una tarjeta propia como en la pantalla de pedidos: acá
 * SÍ hay comparación contra ayer y el `Kpi` ya trae esa fila. La variación es porcentual
 * porque los agregados son de distinta unidad (servicios, pesos, minutos) y un
 * "▲ 9.000" en la tarjeta de tiempos no se leería como minutos.
 */
export async function ResumenServiciosFinalizados({
  datos,
}: {
  datos: Promise<RespuestaServiciosFinalizados>;
}) {
  const { resumen } = await datos;

  const variaciones: Variaciones = {
    completados: variacionPorcentual(resumen.completadosHoy, resumen.ayer.completados),
    valor: variacionPorcentual(resumen.valorDomiciliosHoy, resumen.ayer.valorDomicilios),
    tiempo:
      resumen.tiempoPromedioMin !== null && resumen.ayer.tiempoPromedioMin !== null
        ? variacionPorcentual(resumen.tiempoPromedioMin, resumen.ayer.tiempoPromedioMin)
        : null,
  };

  return (
    <section
      aria-label="Resumen de servicios finalizados"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
    >
      <KpisDelDia resumen={resumen} variaciones={variaciones} />
      <KpisDeCalidad resumen={resumen} />
    </section>
  );
}

/**
 * Cuánto se completó hoy: los servicios, la plata y el tiempo.
 *
 * En los tiempos, subir es la mala noticia: el rojo va cuando la variación es positiva.
 * Sin eso, un servicio que tarda más se pintaría de verde.
 */
function KpisDelDia({ resumen, variaciones }: { resumen: Resumen; variaciones: Variaciones }) {
  const { completados, valor, tiempo } = variaciones;

  return (
    <>
      <Kpi
        icono="check"
        colorIcono="text-exito"
        etiqueta="Completados hoy"
        valor={numero(resumen.completadosHoy)}
        periodo="Hoy"
        variacion={textoVariacion(completados)}
        neutro={completados === null}
        baja={completados !== null && completados < 0}
      />
      <Kpi
        icono="dolar"
        colorIcono="text-info"
        etiqueta="Valor de domicilios"
        valor={moneda(resumen.valorDomiciliosHoy)}
        periodo="Hoy"
        variacion={textoVariacion(valor)}
        neutro={valor === null}
        baja={valor !== null && valor < 0}
      />
      <Kpi
        icono="reloj"
        colorIcono="text-morado"
        etiqueta="Tiempo promedio"
        valor={resumen.tiempoPromedioMin === null ? "Sin dato" : duracion(resumen.tiempoPromedioMin)}
        periodo="Hora a hora, entre recogida y entrega"
        variacion={textoVariacion(tiempo)}
        neutro={tiempo === null}
        baja={tiempo !== null && tiempo > 0}
      />
    </>
  );
}

/**
 * Con qué calidad se cerraron: la calificación promedio y las incidencias.
 *
 * Las dos van SIN tendencia, y no es un olvido: la calificación promedio no tiene
 * comparación en el contrato, y las incidencias no tienen fuente —no existe el modelo
 * en ningún servicio—. Esa tarjeta dice "sin dato" en lugar de 0: un 0 afirmaría que
 * hoy no hubo ninguna, que es justo lo que no se sabe.
 */
function KpisDeCalidad({ resumen }: { resumen: Resumen }) {
  return (
    <>
      <Kpi
        icono="estrella"
        colorIcono="text-alerta"
        etiqueta="Calificación promedio"
        valor={
          resumen.calificacionPromedio === null ? "Sin dato" : calificacion(resumen.calificacionPromedio)
        }
        periodo={textoCalificaciones(resumen.calificacionesContadas)}
      />
      <Kpi
        icono="triangulo"
        colorIcono="text-peligro"
        etiqueta="Con incidencias"
        valor={resumen.conIncidencias === null ? "Sin dato" : numero(resumen.conIncidencias)}
        periodo={resumen.conIncidencias === null ? "No hay modelo de incidencias todavía" : "Hoy"}
      />
    </>
  );
}

/**
 * "▲ 18%" o "Sin dato".
 *
 * Cuando ayer no tiene base no se inventa un porcentaje: `variacionPorcentual` devuelve
 * `null` justamente para que quien lo muestra diga "sin dato" en lugar de un -100% que
 * sería falso.
 */
function textoVariacion(valor: number | null): string {
  return valor === null ? "Sin dato" : variacion(valor);
}

/** "basado en 1 calificación" / "basado en 42 calificaciones". */
function textoCalificaciones(cantidad: number): string {
  return cantidad === 1
    ? "basado en 1 calificación"
    : `basado en ${numero(cantidad)} calificaciones`;
}
